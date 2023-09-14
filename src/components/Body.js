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

    setInputValue("");
  };

  useEffect(() => {
    console.log(donationAmount);
    donate({
      // onComplete:
      // onError:
      onSuccess: handleSuccess,
      onError: (error) => console.log(error),
    });
  }, [donationAmount]);
  return (
    <div className="p-5">
      <p className="text-center text-lg text-red-500 font-semibold">
        This is a play project. Please do not donate real money. You can use
        SEPOLIA Testnet ETH for testing. Also minimum Donation is 0.1 SEPOLIA
        Testnet ETH, sorry broke boys LMAO!!!
      </p>
      <h2 className="text-center text-xl font-semibold mt-4">
        Donate Your Coins
      </h2>
      <div className="mt-6">
        <label htmlFor="amount" className="block text-gray-700">
          Amount you want to donate:
        </label>
        <div className="mt-2 relative rounded-md shadow-sm">
          <input
            id="amount"
            className="form-input block w-full pr-10 sm:text-sm sm:leading-5 border-gray-300 rounded-md"
            type="number"
            required
            placeholder="Enter Amount"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500">SEPOLIA</span>
          </div>
        </div>
      </div>
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        type="button"
        onClick={handleDonatebtn}
        disabled={isLoading || isFetching}
      >
        {isLoading || isFetching ? (
          <div className="animate-spin h-8 w-8 border-b-2 rounded-full"></div>
        ) : (
          "Donate"
        )}
      </button>
      <p className="mt-4 text-center">
        Total amount raised so far:{" "}
        {ethers.utils.formatUnits(totalAmountDonated, "ether")} ETH
      </p>
    </div>
  );
}
