const { GraphQLError } = require("graphql");
const Books = require("./models/book");
const Authors = require("./models/author");
const User = require("./models/users");
const jwt = require("jsonwebtoken");
const DataLoader = require('dataloader');

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const bookCountLoader = new DataLoader(async (authorIds) => {
  const books = await Books.find({ author: { $in: authorIds } });
  return authorIds.map(authorId => books.filter(book => book.author.toString() === authorId.toString()).length);
})

const resolvers = {
  Query: {
    bookCount: async () => Books.collection.countDocuments(),
    authorCount: async () => Authors.collection.countDocuments(),
    allBooks: async () => {
      return await Books.find({}).populate("author");
    },
    allAuthors: async (root, args) => {
      return Authors.find({});
    },
    findBooks: async (root, args) => {
      const author = await Authors.findOne({ name: args.author });
      if (!author) return [];
      return await Books.find({ author: author._id }).populate("author");
    },
    booksByGenre: async (root, args) => {
      let query = {};
      if (args.genre) {
        query.genres = args.genre;
      }
      if (args.author) {
        const author = await Authors.findOne({ name: args.author });
        if (author) {
        }
      }
      return await Books.find(query).populate("author");
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Author: {
    bookCount: async (author) => {
      return bookCountLoader.load(author._id);
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      let author = await Authors.findOne({ name: args.author });

      if (!author) {
        author = new Authors({
          name: args.author,
          born: null,
        });
        try {
          await author.save();
        } catch (error) {
          throw new GraphQLError("Saving author failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
              error: error.message,
            },
          });
        }
      }

      const book = new Books({
        title: args.title,
        published: args.published,
        genres: args.genres,
        author: author._id,
      });

      try {
        await book.save();
        const savedBook = await book.populate("author");
        pubsub.publish('BOOK_ADDED', { bookAdded: savedBook })
        return savedBook;
      } catch (error) {
        if (error.name === "ValidationError") {
          throw new GraphQLError("Book validation failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args,
              error: Object.values(error.errors)
                .map((e) => e.message)
                .join(", "),
            },
          });
        }
        throw new GraphQLError("Saving book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            error: error.message,
          },
        });
      }
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      try {
        const updatedAuthor = await Authors.findOneAndUpdate(
          { name: args.name },
          { born: args.setBornTo },
          { new: true, runValidators: true }
        );
        if (!updatedAuthor) {
          throw new GraphQLError("Author not found", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.name,
            },
          });
        }
        return updatedAuthor;
      } catch (error) {
        if (error.name === "ValidationError") {
          throw new GraphQLError("Author validation failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args,
              error: Object.values(error.errors)
                .map((e) => e.message)
                .join(", "),
            },
          });
        }
        throw error;
      }
    },

    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError("creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator(['BOOK_ADDED'])  
    }
  }
}

module.exports = resolvers