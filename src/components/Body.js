import { contractAddresses, abi } from "../../constants";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
// import { useNotification } from "web3uikit";
import { ethers } from "ethers";

export default function Body() {
  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis();

  const chainId = parseInt(chainIdHex);

  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const [donationAmount, setDonationAmount] = useState("0");
  const [totalAmountDonated, setTotalAmountDonated] = useState("0");
  const [inputValue, setInputValue] = useState("");

  const {
    runContractFunction: donate,
    data: enterTxResponse,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "donate",
    msgValue: ethers.utils.parseUnits(donationAmount),
    params: {},
  });

  const { runContractFunction: getTotalDonation } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, // specify the networkId
    functionName: "getTotalDonation",
    params: {},
  });

  async function updateUIValues() {
    const totalDonatedAmountFromCall = (await getTotalDonation()).toString();
    setTotalAmountDonated(totalDonatedAmountFromCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUIValues();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async (tx) => {
    try {
      await tx.wait(1);
      updateUIValues();

      // handleNewNotification(tx);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDonatebtn = async () => {
    setDonationAmount(inputValue);
    console.log(donationAmount);
    await donate({
      // onComplete:
      // onError:
      onSuccess: handleSuccess,
      onError: (error) => console.log(error),
    });
    setInputValue("");
  };
  return (
    <div className="p-5">
      <p className="text-center text-xl py-2">Donate your coins</p>
      <div className="pt-5">
        <label for="amount">Amount you want to donate : </label>

        <input
          className="border-solid border-2 border-black"
          type="number"
          required
          placeholder="Enter Amount"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
          type="button"
          onClick={handleDonatebtn}
          disabled={isLoading || isFetching}
        >
          {isLoading || isFetching ? (
            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
          ) : (
            "Donate"
          )}
        </button>
      </div>
      <p className="py-5">
        Total amount raised so far:{" "}
        {ethers.utils.formatUnits(totalAmountDonated, "ether")} ETH{" "}
      </p>
    </div>
  );
}
