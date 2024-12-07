"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { LoginButton } from "./components/LoginButton";
import { useOkto, OktoContextType, BuildType, AuthType } from "okto-sdk-react";
import GetButton from "./components/GetButton";
import TransferTokens from "./components/TransferTokens";
import { useAppContext } from "./components/AppContext";
import AuthButton from "./components/AuthButton";
import SendRawTransaction from "./components/SendRawTransaction";
import { EmailOTPVerification } from "./components/EmailOTPVerification";
import { PhoneOTPVerification } from "./components/PhoneOTPVerification";
import BlinkComp from "./components/BlinkComp";

export default function Home() {
  const { data: session } = useSession();
  const { apiKey, setApiKey, buildType, setBuildType } = useAppContext();
  const {
    isLoggedIn,
    authenticate,
    authenticateWithUserId,
    logOut,
    getPortfolio,
    transferTokens,
    getWallets,
    createWallet,
    getSupportedNetworks,
    getSupportedTokens,
    getUserDetails,
    orderHistory,
    getNftOrderDetails,
    showWidgetModal,
    showOnboardingModal,
    getRawTransactionStatus,
    transferTokensWithJobStatus,
    transferNft,
    transferNftWithJobStatus,
    executeRawTransaction,
    executeRawTransactionWithJobStatus,
    setTheme,
    getTheme,
    readContractData
  } = useOkto() as OktoContextType;
  const idToken = useMemo(() => (session ? session.id_token : null), [session]);

  const [blinkUrl, setBlinkUrl] = useState("");
  const [isBlinkAdded, setIsBlinkAdded] = useState(false);

  async function handleAuthenticate(): Promise<any> {
    if (!idToken) {
      return { result: false, error: "No google login" };
    }
    return new Promise((resolve) => {
      authenticate(idToken, (result: any, error: any) => {
        if (result) {
          console.log("Authentication successful");
          resolve({ result: true });
        } else if (error) {
          console.error("Authentication error:", error);
          resolve({ result: false, error });
        }
      });
    });
  }

  async function handleLogout() {
    try {
      logOut();
      return { result: "logout success" };
    } catch (error) {
      return { result: "logout failed" };
    }
  }

  // Add this new function to handle the read contract data
  async function handleReadContract() {
    try {
      const result = await readContractData("POLYGON",
        {
          contractAddress: "0x3BA4c387f786bFEE076A58914F5Bd38d668B42c3",
          abi: {
            inputs: [],
            name: "totalSupply",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256"
              }
            ],
            stateMutability: "view",
            type: "function"
          },
          args: {}
        }
      );
      return result;
    } catch (error) {
      console.error("Read contract error:", error);
      return { error };
    }
  }

  async function handleReadContractAptos() {
    try {
      const result = await readContractData("APTOS_TESTNET",
        {
          function:
          "0x0000000000000000000000000000000000000000000000000000000000000001::chain_id::get",
          typeArguments: [],
          functionArguments: []
        }
      );
      return result;
    } catch (error) {
      console.error("Read contract error:", error);
      return { error };
    }
  }

  const handleAddBlink = () => {
    if (blinkUrl) {
      setIsBlinkAdded(true);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      console.log("Okto is authenticated");
    }
  }, [isLoggedIn]);

  return (
    <main className="flex min-h-screen flex-col items-center space-y-6 p-12 bg-violet-200">
      <div className="text-black font-bold text-3xl mb-8">Okto SDK</div>

      {/* status indicator */}
      <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
        <div className={`w-3 h-3 rounded-full ${isLoggedIn ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-sm font-medium">
          Status: {isLoggedIn ? 'Logged In' : 'Not Logged In'}
        </span>
      </div>

      <div className="space-y-6 w-full max-w-lg">
        <div className="space-y-4">
          <label className="text-black font-semibold">API Key:</label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-4">
          <label className="text-black font-semibold">Build Type:</label>
          <select
            value={buildType}
            onChange={(e) => setBuildType(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={BuildType.SANDBOX}>Sandbox</option>
            <option value={BuildType.STAGING}>Staging</option>
            <option value={BuildType.PRODUCTION}>Production</option>
          </select>
        </div>
      </div>

      <div className="w-full max-w-lg">
        <EmailOTPVerification 
          onVerificationSuccess={() => console.log('Verification successful')}
          onVerificationError={(error) => console.error('Verification failed:', error)}
        />
      </div>

      <div className="w-full max-w-lg">
        <PhoneOTPVerification
          onVerificationSuccess={() => console.log('Verification successful')}
          onVerificationError={(error) => console.error('Verification failed:', error)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-lg mt-8">
        <LoginButton />

        <GetButton title="Okto Authenticate" apiFn={handleAuthenticate} />
        <AuthButton authenticateWithUserId={authenticateWithUserId}/>
        <GetButton title="Okto Log out" apiFn={handleLogout} />

        <h2 className="col-span-2 text-2xl font-semibold text-center">Blinks Showcase</h2>
        <BlinkComp
          propActionApiUrl="https://jup.ag/swap/SOL-SEND"
          websiteText="jupiter"
          className="col-span-2"
        />

        {!isBlinkAdded && (
          <div className="col-span-2 flex flex-col items-center space-y-4">
            <input
              type="text"
              placeholder="Enter Blink URL"
              value={blinkUrl}
              onChange={(e) => setBlinkUrl(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddBlink}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Blink
            </button>
          </div>
        )}

        {isBlinkAdded && (
          <BlinkComp
            propActionApiUrl={blinkUrl}
            websiteText="New Blink"
            className="col-span-2"
          />
        )}

        <GetButton title="getPortfolio" apiFn={getPortfolio} />
        <GetButton title="getSupportedNetworks" apiFn={getSupportedNetworks} />
        <GetButton title="getSupportedTokens" apiFn={getSupportedTokens} />
        <GetButton title="getUserDetails" apiFn={getUserDetails} />
        <GetButton title="getWallets" apiFn={getWallets} />
        <GetButton title="createWallet" apiFn={createWallet} />
        <GetButton title="orderHistory" apiFn={() => orderHistory({})} />
        {/* <GetButton title="getRawTransactionStatus" apiFn={() => getRawTransactionStatus({})} /> */}
        <GetButton
          title="getNftOrderDetails"
          apiFn={() => getNftOrderDetails({})}
        />
        <GetButton title="Read Contract Data" apiFn={handleReadContract} />
        <GetButton title="Read Contract Aptos" apiFn={handleReadContractAptos} />
        <button
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => {
            showWidgetModal();
          }}
        >
          Show Modal
        </button>
        <button
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => {
            showOnboardingModal(AuthType.GAUTH, "Test App");
          }}
        >
          Show Onboarding Modal
        </button>
      </div>
      
      <div className="flex flex-col gap-2 w-full max-w-lg">
        <TransferTokens apiFn={transferTokens} />
        <SendRawTransaction apiFn={executeRawTransaction} />
      </div>
    </main>
  );
}

