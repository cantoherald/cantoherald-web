import { Headline, Stretcher } from "../components";
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
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Subscribe() {
  const [error, setError] = useState<string>("");
  const { address } = useAccount();

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

  console.log("isSuccess", isSuccess, rest);

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
        <div className="col-span-4 col-start-8">
          <div className="bg-base-100 rounded-lg p-4 shadow-lg mt-40 text-white">
            <Headline>Subscribe!</Headline>
            <p className="mb-4">
              Hit the subscribe button to subscribe to the Canto Herald
              on-chain. Read our weekly issue and participate in limited edition
              Canto Herald newspaper NFTs.
            </p>
            {showSuccess && (
              <p className="text-success mt-2">You are subscribed! 🎉</p>
            )}
            {!address && <ConnectButton />}
            {!isSuccess &&
              (subscribedAt as BigNumber)?.eq(BigNumber.from("0")) && (
                <button
                  className="btn bg-neon hover:bg-neon/75 text-black"
                  disabled={isLoading}
                  onClick={onSubscribe}
                >
                  {isLoading ? "Subscribing..." : "Subscribe LFG 🔥"}
                </button>
              )}

            {!!error && <p className="text-error mt-2">{error}</p>}
          </div>
        </div>
      </div>
      <Stretcher />
    </>
  );
}
