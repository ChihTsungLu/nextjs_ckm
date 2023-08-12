import { GraphQLClient } from "graphql-request";

import { createProjectMutation, createUserMutation, deleteProjectMutation, updateProjectMutation, getProjectByIdQuery, getProjectsOfUserQuery, getUserQuery, projectsQuery } from "@/graphql";
import { ProjectForm } from "@/common.types";

const isProduction = process.env.NODE_ENV === 'production';
const apiUrl = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || '' : 'http://127.0.0.1:4000/graphql';
const apiKey = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || '' : 'letmein';
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : 'http://localhost:3000';

const client = new GraphQLClient(apiUrl);

export const fetchToken = async () => {
  try {
    const response = await fetch(`${serverUrl}/api/auth/token`);
    return response.json();
  } catch (err) {
    throw err;
  }
};

//Google Auth
export const getUser = (email:string) =>{
  client.setHeader('x-api-key', apiKey);
  return makeGraphQLRequest(getUserQuery, {email})
}

export const createUser = (name: string, email: string, avatarUrl: string) =>{
  client.setHeader('x-api-key', apiKey);
  const variables = {
    input: {
      name, email, avatarUrl
    }
  }
}
export const uploadImage = async (imagePath: string) => {
  try {
    const response = await fetch(`${serverUrl}/api/upload`, {
      method: "POST",
      body: JSON.stringify({
        path: imagePath,
      }),
    });
    return response.json();
  } catch (err) {
    throw err;
  }
};

const makeGraphQLRequest = async (query: string, variables = {}) => {
  try {
    return await client.request(query, variables);
  } catch (err) {
    throw err;
  }
};


export const createNewProject = async (form: ProjectForm, creatorId: string, token: string) => {
  const imageUrl = await uploadImage(form.image);
  
  if (imageUrl.url) {
    client.setHeader("Authorization", `Bearer ${token}`);
    
    const variables = {
      input: { 
        ...form, 
        image: imageUrl.url, 
        createdBy: { 
          link: creatorId 
        }
      }
    };
    
    return makeGraphQLRequest(createProjectMutation, variables);
  }
};

// api/page.tsx - post data  
export const fetchAllProjects = (category?: string | null, endcursor?: string | null) => {
  client.setHeader("x-api-key", apiKey);  

  return makeGraphQLRequest(projectsQuery, { category, endcursor });
};

//呈現先前建立專案的資料
export const getProjectDetail = (id: string) => {
  client.setHeader('x-api-key', apiKey);
  return makeGraphQLRequest(getProjectByIdQuery,{id})
}
//for RelatedProjects
export const getUsersProjects = (id: string, last?: number) => {
  client.setHeader('x-api-key', apiKey);
  return makeGraphQLRequest(getProjectsOfUserQuery,{id, last})
}

//for ProjectAction - delete
export const deleteProject = (id: string, token: string ) => {
  client.setHeader("Authorization", `Bearer ${token}`);
  return makeGraphQLRequest(deleteProjectMutation,{id})
}

//for ProjectAction - edit
export const updateProject = async(form: ProjectForm, projectId:string, token:string ) => {
  // check if the user has re-uploaded image or not by checking image url is base64 string(new one) or not
  
  function isBase64DataUrl(value: string){
    const base64Regex = /^data:image\/[a-z]+;base64,/;
    return base64Regex.test(value);
  }

  let updatedForm ={...form}; //previous form
  

  const isUploadingNewImage = isBase64DataUrl(form.image);
  
  if(isUploadingNewImage){
    const imageUrl = await uploadImage(form.image); 

    if(imageUrl.url){
      updatedForm = {
        ...form,
        image:imageUrl.url //change the image to the new one
      }
    }
  }
  
  const variables = {
    id: projectId,
    input: updatedForm,
  }
  console.log(form)
  
  client.setHeader("Authorization", `Bearer ${token}`);
  return makeGraphQLRequest(updateProjectMutation,variables )
}