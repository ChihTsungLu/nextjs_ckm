import { UserProfile } from "@/common.types"
import ProfilePage from "@/components/ProfilePage"
import { getUsersProjects } from "@/lib/actions"


type Props ={
    params: {
        id:string
    }
}
const UserProfile = async({ params }: Props) => {
  const result = await getUsersProjects(params.id,10) as { user: UserProfile}
  
  if(!result?.user){
    return <p className="no-result-text"> Failed to fetch user info </p>
  }
  return (
    <ProfilePage user={result?.user}/>
  )
}

export default UserProfile