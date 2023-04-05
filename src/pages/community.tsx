import { useContractRead } from "wagmi";
import { BigNumber, ethers } from "ethers";
import { Headline, Stretcher } from "../components";
import { CantoHeraldAbi, CANTO_HERALD_ADDRESS } from "../contracts";

export default function Community() {
  const { data: totalSubscribersCount } = useContractRead({
    address: CANTO_HERALD_ADDRESS,
    abi: CantoHeraldAbi,
    functionName: "getSubscribersCount",
  });

  const { data: subscriberData } = useContractRead({
    address: CANTO_HERALD_ADDRESS,
    abi: CantoHeraldAbi,
    functionName: "getSubscribers",
    args: [0],
  });

  const [subscribers, subscribedAt] = (subscriberData as [
    string[],
    BigNumber[]
  ]) || [[], []];

  // filter out zero addresses
  const filteredSubscribers = useMemo(() => {
    return (subscribers as string[])?.filter(
      (subscriber: string) => subscriber !== ethers.constants.AddressZero
    );
  }, [subscribers]);

  return (
    <div className="grid grid-cols-12 text-white px-8 pt-8">
      <div className="col-span-12">
        <Headline className="pb-2">
          List of subscribers
          {totalSubscribersCount
            ? ` [total = ${totalSubscribersCount.toString()}]`
            : ""}
        </Headline>
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Address</th>
                <th>Subscribed At</th>
              </tr>
            </thead>
            <tbody>
              {(filteredSubscribers as string[])?.map(
                (subscriber: string, index: number) => (
                  <tr>
                    <th>{index}</th>
                    <td>{subscriber}</td>
                    <td>
                      {new Date(
                        subscribedAt[index]
                          .mul(BigNumber.from("1000"))
                          .toNumber()
                      ).toDateString()}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Stretcher />
    </div>
  );
}
