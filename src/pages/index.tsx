import { Headline, Stretcher, Text } from "../components";
import Marquee from "react-fast-marquee";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { CantoHeraldAbi, CANTO_HERALD_ADDRESS } from "../contracts";
import { BigNumber } from "ethers";
import { Link } from "react-router-dom";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import { MAILCHIMP_SIGNUP_URL } from "../constants";

export default function Subscribe() {
  const [error, setError] = useState<string>("");
  const { address } = useAccount();
  const [email, setEmail] = useState("");

  const { data: subscribedAt } = useContractRead({
    address: CANTO_HERALD_ADDRESS,
    abi: CantoHeraldAbi,
    functionName: "subscribedAt",
    args: [address],
    enabled: !!address,
  });

  const { config } = usePrepareContractWrite({
    address: CANTO_HERALD_ADDRESS,
    abi: CantoHeraldAbi,
    functionName: "subscribe",
    enabled: (subscribedAt as BigNumber)?.eq(BigNumber.from("0")),
  });

  const {
    data: subscribeResult,
    isLoading: isLoadingSubmit,
    write,
  } = useContractWrite(config);

  const {
    isLoading: isLoadingConfirm,
    isSuccess,
    ...rest
  } = useWaitForTransaction({
    hash: subscribeResult?.hash,
    confirmations: 1,
  });

  const isLoading = useMemo(
    () => isLoadingSubmit || isLoadingConfirm,
    [isLoadingSubmit, isLoadingConfirm]
  );

  const onSubscribe = useCallback(() => {
    if (isLoading) {
      return;
    }

    if (!address) {
      setError("Please connect your wallet first");
    }

    write?.();
    setError("");
  }, [address, isLoading, write]);

  const showSuccess = useMemo(
    () => isSuccess || (subscribedAt as BigNumber)?.gt(BigNumber.from("0")),
    [isSuccess, subscribedAt]
  );

  return (
    <>
      <Marquee gradient={false} speed={100}>
        <span className="text-2xl bg-neon w-full text-black pt-1">
          Sign up for The Canto Herald - the fastest news publication on
          @CantoPublic
        </span>
      </Marquee>
      <div className="grid grid-cols-12">
        <div className="col-span-10 col-start-2 sm:col-span-8 sm:col-start-3 lg:col-span-4 lg:col-start-8">
          <div className="bg-base-100 rounded-lg p-4 shadow-lg mt-8 lg:mt-40 text-white">
            <Headline>Subscribe</Headline>
            <p className="mb-4">
              Enter your email and hit the subscribe button to get the latest
              news from the Canto Herald straight to your inbox.
            </p>
            <MailchimpSubscribe
              url={MAILCHIMP_SIGNUP_URL}
              render={({ subscribe, status, message }) => (
                <>
                  <div className="input-group input-group-vertical mb-4">
                    <input
                      type="text"
                      placeholder="Email address 📧"
                      className="input input-bordered"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!!status}
                    />
                    <button
                      className="btn bg-neon hover:bg-neon/75 text-black"
                      disabled={!!status}
                      onClick={() => subscribe({ EMAIL: email })}
                    >
                      {status === "success"
                        ? "Subscribed ✅"
                        : status === "error"
                        ? "Error ❌"
                        : "Subscribe"}
                    </button>
                  </div>
                  {status === "success" && (
                    <Text className="text-sm">
                      Success! You're almost there. To complete your newsletter
                      subscription, please check your inbox and click the
                      confirmation button in the email we've just sent you.
                      Happy reading!
                    </Text>
                  )}
                </>
              )}
            />
          </div>
          <div className="bg-base-100 rounded-lg p-4 shadow-lg mt-8 text-white">
            <Headline>Latest Episode!</Headline>
            <p className="mb-4">
              Click the button below to read the latest issue of the Canto
              Herald.
            </p>
            <Link
              to="https://us21.campaign-archive.com/home/?u=443654daec0631342d75e1179&id=e5b1a0e2c2"
              target="_blank"
            >
              <button
                className="btn bg-neon hover:bg-neon/75 text-black"
                disabled={isLoading}
                onClick={onSubscribe}
              >
                Latest Issue 🗞️
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Stretcher />
    </>
  );
}
