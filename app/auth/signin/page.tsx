import { getProviders } from "next-auth/react";
import Image from "next/image";
import SignInComponent from "./SignInComponent";

async function SignInPage() {
  const providers = await getProviders();
  return (
    <div className="grid justify-center">
      {/* <div>
            <Image className="mx-2 object-cover" width={500} height={500} src="https://aleph42.s3.amazonaws.com/aleph-logo.png" alt="Profile Picture"/>
        </div> */}

      <SignInComponent providers={providers} />
    </div>
  );
}

export default SignInPage;
