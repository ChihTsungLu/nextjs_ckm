import { ProjectInterface, UserProfile } from '@/common.types'
import Image from 'next/image'

import Link from 'next/link'
import Button from "./Button";
import ProjectCard from './ProjectCard';

type Props = {
    user: UserProfile;
}

const  ProfilePage = ({ user }: Props) => (
    <section className='flexCenter flex-col max-w-10xl w-full mx-auto paddings'>
        <section className="flexBetween max-lg:flex-col gap-10 w-full">
            <div className='flex items-start flex-col w-full'>
                <div className='flex flex-row '>
                    <Image src={user?.avatarUrl} width={100} height={100} className="rounded-full" alt="user image" />
                    <p className="text-4xl font-bold mt-10 ml-4">{user?.name}</p>
                </div>
                <div className='flex flex-col space-y-4'>
                    <p className="md:text-xl text-xl font-bold md:mt-10 mt-5 ">
                        I'm an avid tech and startup enthusiast who finds joy in crafting code and bringing ideas to life through innovative products.
                    </p>
                    <p>
                        My toolkit includes React, Tailwind, Next, and TypeScript, which I wield skillfully to establish a robust and sustainable codebase.
                    </p>
                    <p>
                        Currently, I'm engrossed in the creation of a dynamic website that serves as a repository for a diverse spectrum of technological knowledge. 
                    </p>

                </div>
                <div className="flex mt-8 gap-5 w-full flex-wrap">
                    <Button
                        title="Follow"
                        leftIcon="/plus-round.svg"
                        bgColor="bg-light-white-400 !w-max"
                        textColor="text-black-100"
                    />
                    <Link href={`mailto:${user?.email}`}>
                        <Button title="Hire Me" leftIcon="/email.svg" />
                    </Link>
                </div>
            </div>

         
        </section>

        <section className="flexStart flex-col lg:mt-28 mt-16 w-full">
            <p className="w-full text-left text-lg font-semibold">Recent Work</p>

            <div className="profile_projects">
                {user?.projects?.edges?.map(
                    ({ node }: { node: ProjectInterface }) => (
                        <ProjectCard
                            key={`${node?.id}`}
                            id={node?.id}
                            image={node?.image}
                            title={node?.title}
                            name={user.name}
                            avatarUrl={user.avatarUrl}
                            userId={user.id}
                        />
                    )
                )}
            </div>
        </section>
    </section>
)

export default ProfilePage