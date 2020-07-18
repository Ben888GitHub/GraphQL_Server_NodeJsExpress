const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");
const axios = require("axios");

/*
// Hardcoded data instead of Database
const customers = [
  {
    id: "1",
    name: "John Doe",
    email: "jdoe@gmail.com",
    age: 35,
  },
  {
    id: "2",
    name: "Steve Smith",
    email: "steve@gmail.com",
    age: 25,
  },
  {
    id: "3",
    name: "Sarah Williams",
    email: "sarah@gmail.com",
    age: 32,
  },
];
*/

// 2 Customer Type
const CustomerType = new GraphQLObjectType({
  name: "Customer",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
});

// 1 Root Query (Get)
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  // (1) Create a fields object
  fields: {
    // First field
    customer: {
      type: CustomerType, // (2) Customer Type System
      args: {
        id: { type: GraphQLString }, // (3) Query customers by id
      },
      resolve(parentValue, args) {
        // resolve() is a query handler, which is a function to generate responses
        /*for (let i = 0; i < customers.length; i++) {
          if (customers[i].id == args.id) {
            return customers[i];
          }
        }*/
        return axios
          .get(`http://localhost:3000/customers/${args.id}`)
          .then((res) => res.data);
      },
    },
    // Second Field
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
        // return customers;
        return axios
          .get("http://localhost:3000/customers")
          .then((res) => res.data);
      },
    },
  },
});

// Mutation (Add, Delete, Update)
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parentValue, args) {
        return axios
          .post("http://localhost:3000/customers", {
            name: args.name,
            email: args.email,
            age: args.age,
          })
          .then((res) => res.data);
      },
    },
    deleteCustomer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return axios
          .delete(`http://localhost:3000/customers/${args.id}`)
          .then((res) => res.data);
      },
    },
    editCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        return axios
          .put(`http://localhost:3000/customers/${args.id}`, {
            name: args.name,
            email: args.email,
            age: args.age,
          })
          .then((res) => res.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  //root query
  query: RootQuery,
  mutation: mutation,
});
