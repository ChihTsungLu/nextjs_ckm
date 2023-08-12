import { redirect } from "next/navigation"
import Modal from "@/components/Modal"
import ProjectForm from "@/components/ProjectForm"
import { getCurrentUser } from "@/lib/session"
import { getProjectDetail } from "@/lib/actions"
import { ProjectInterface } from "@/common.types"

const EditKnowledge = async({ params : {id}}:{params:{id:string}}) => {
  const session = await getCurrentUser();
  if(!session?.user) redirect('/')

  //populate the previous built project
  // id is from the web url params
  const result = await getProjectDetail(id) as {project?: ProjectInterface}
  return (
    <Modal>
      <h3 className="modal-head-text"> Edit a New Project</h3>
      <ProjectForm type="edit" session={session} project={result?.project}/>
    </Modal>
  )
}

export default EditKnowledge