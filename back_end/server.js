const express = require('express');
const app = express();
const fs = require("fs");
const filesize = require("filesize");

const graphql = require("graphql");
const {GraphQLBoolean} = require("graphql");
const {GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString} = graphql;
const cors = require('cors');

const { graphqlHTTP } = require('express-graphql');



function getDirectories(path) {
    return fs.readdirSync(path).filter( (file)=> {
        return fs.statSync(path+'/'+file);
    });
}
function getFileSize(path){
    let stats = fs.statSync(path)
    return  filesize(stats.size, {round: 0});
}

function getCreatedData(path){
    return  fs.statSync(path).birthtime;
}

function permission(path) {
    try {
        fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK);
        return "read/write";
    } catch (err) {
        return "read only";
    }
}



//full directory listing
const UserType = new GraphQLObjectType({
    name:"User",
    fields: ()=>({
        id: {type:GraphQLInt},
        fileName: {type:GraphQLString},
        fullPath: {type:GraphQLString},
        fileSize: {type:GraphQLString},
        createdDate: {type:GraphQLString},
        permission: {type:GraphQLString},
        isDirectory: {type:GraphQLBoolean},
    })
})

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields:{
        getFullDirectoryListing:{
            type: new GraphQLList(UserType),
            args: {
                path:{
                    type: GraphQLString
                }
            },
            resolve(parent, args){

                let list = getDirectories(args.path);
                let returnList = [];

                for (let i=0;i<list.length;i++){

                    let fullPath = args.path+"/"+list[i];

                    returnList.push({
                        "id":i,
                        "fileName":list[i],
                        "fullPath":fullPath,
                        "fileSize":getFileSize(fullPath),
                        "createdDate": getCreatedData(fullPath).toLocaleDateString(),
                        "permission":permission(fullPath),
                        "isDirectory":fs.lstatSync(fullPath).isDirectory()

                    })
                }

                return returnList;

            }

        }
    }
});


const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields:{
        createUser:{
            type: new GraphQLList(UserType),
            args: {
                fileName : {type: GraphQLString}
            },
            resolve(parent, args){
                //queries go here
            }

        }
    }
});

const schema = new GraphQLSchema({query:RootQuery, mutation:Mutation})

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use( cors() );
app.use('/graphQL', graphqlHTTP({
    schema,
    graphiql:true,
}));

const appa = app.listen(8081,  ()=> {
    let host = appa.address().address;
    let port = appa.address().port;
    //console.log("Example app listening at http://%s:%s", host, port)
});
