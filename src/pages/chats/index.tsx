import React from "react";
import Image from "next/image";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

// export const getServerSideProps = async ({ req, res }) => {
//   try {    
//     const token = req.headers.cookie;
//     const decodedToken = JSON.parse(decodeURIComponent(token.split('=')[1]));
    
//     const request = await fetch(`/api/users/user`);
//     const response = await request.json();
//     console.log('request', response);
    

//     return {
//       props: {
//         test: decodedToken.id,
//       },
//     };
//   } catch (error) {
//     return {
//       props: {
//         test: 'error',
//       },
//     };
//   }
// };

interface ssrProps {
  sample: string
}

export const getServerSideProps = (async ({req}) => {
  try {
    const token = req.headers.cookie;
    const decodedToken = JSON.parse(decodeURIComponent(token.split('=')[1]));
    const protocol = req.headers['x-forwarded-proto'];
    const origin: string = `${protocol}://${req.headers.host}`
    const request = await fetch(`${origin}/api/users/${decodedToken.id}`);
    const response = await request.json();
    console.log('response', response);
    

    return {
      props: {
        test: {
          sample: decodedToken.id
        } 
      }
    }
  } catch (error) {
    return {
      props: {
        test: {
          sample: `${error}`
        } 
      }
    }
  }
}) satisfies GetServerSideProps<{test: ssrProps}>

export default function Chats({ test }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log("SSR test", test);

  return (
    <div className="w-full h-full flex items-center justify-center flex-col gap-3">
      <div className="relative w-2/3 h-2/3">
        <Image
          src={"/img/group-people-chatting.png"}
          alt="Icon"
          sizes="100"
          fill
          priority
        />
      </div>
      <h3 className="font-sans text-2xl text-[#183B4E]">
        No Selected Conversation
      </h3>
    </div>
  );
}
