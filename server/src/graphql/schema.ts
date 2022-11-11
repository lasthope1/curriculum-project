import 'graphql-import-node'
import { makeExecutableSchema } from '@graphql-tools/schema'
import * as rootDefs from '../graphql/schemas/schema.graphql'
import { resolvers } from './resolvers/resolvers'

const schema = makeExecutableSchema({
   typeDefs: [rootDefs],
   resolvers: resolvers
})

export default schema