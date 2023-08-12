import { ProjectInterface } from "@/common.types";
import Modal from "@/components/Modal";
import ProjectAction from "@/components/ProjectAction";
import RelatedProjects from "@/components/RelatedProjects";
import { getProjectDetail } from "@/lib/actions";
import { getCurrentUser } from "@/lib/session";
import Image from "next/image";
import Link from "next/link";


const Project = async ({ params: { id } }: { params: { id: string } }) => {

    const session = await getCurrentUser();
    // id is from the params of the page by destructuring the id by destructuring the params
    const result = await getProjectDetail(id) as { project?: ProjectInterface }

    const projectDetails = result?.project
    const renderLink = () => `/profile/${projectDetails?.createdBy?.id}`
    if (!result?.project) {
        <p>Failed to fetch project info</p>
    }
    // in console since it's rendered in client side
    // console.log(result?.project) 
    return (
        <Modal>
            <section className="flexBetween gap-y-8 max-w-4xl max-xs:flex-col w-full">
                <div className="flex-1 flex itemr-start gap-5 w-full max-xs:flex-col">
                    <Link href={renderLink()}>
                        <Image
                            src={projectDetails?.createdBy?.avatarUrl}
                            width={50}
                            height={50}
                            alt="profile"
                            className="rounded-full"
                        />
                    </Link>
                    <div className="flex-1 flexStart flex-col gap-1">
                        <p className="self-start text-lg font-semibold">
                            {projectDetails?.title}
                        </p>
                        <div className="user-info">
                            <Link href={renderLink()}>
                                {projectDetails?.createdBy?.name}
                            </Link>
                            <Image src="/dot.svg" width={4} height={4} alt="dot" />
                            <Link href={`/?category=${projectDetails?.category}`} className="text-primary-purple font-semibold">
                                {projectDetails?.category}
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Delete */}
                {session?.user?.email === projectDetails?.createdBy?.email && (
                    <div className="flex justify-end items-center gap-2">
                        <ProjectAction projectId={projectDetails?.id} />
                    </div>
                )}
            </section>

            <section className="mt-14">
                <Image
                    src={`${projectDetails?.image}`}
                    className="object-cover rounded-2xl"
                    width={764}
                    height={498}
                    alt="poster"
                />
                <h3 className="mt-10 text-2xl ">Description</h3>
            </section>

            <section className="flexCenter flex-col mt-5 ">
                <p className="max-w-5xl text-xl font-normal">
                    {projectDetails?.description}
                </p>
                <div className="flex flex-wrap mt-5 gap-5">
                    <Link href={projectDetails?.githubUrl} target="_blank" rel="noreferrer" className="flexCenter gap-2 tex-sm font-medium text-primary-purple">
                        🖥 <span className="underline">Github</span>
                    </Link>
                    <Image src="/dot.svg" width={4} height={4} alt="dot" />
                    <Link href={projectDetails?.liveSiteUrl} target="_blank" rel="noreferrer" className="flexCenter gap-2 tex-sm font-medium text-primary-purple">
                        🚀 <span className="underline">Live Site</span>
                    </Link>
                </div>
            </section>

            <section className="flexCenter w-full gap-8 mt-28">
                <span className="w-full h-0.5 bg-light-white-200" />
                <Link href={renderLink()} className="min-w-[82px] h-[82px]">
                    <Image
                        src={projectDetails?.createdBy?.avatarUrl}
                        className="rounded-full"
                        width={82}
                        height={82}
                        alt="profile image"
                    />
                </Link>

                <span className="w-full h-0.5 bg-light-white-200" />
            </section>

            <RelatedProjects userId={projectDetails?.createdBy?.id} projectId={projectDetails?.id}/>
        </Modal>
    )
}

export default Project