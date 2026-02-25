import React, { useEffect, useContext, useCallback } from "react";

import Header from "./Components/Headers";
import Products from "./Components/ProductTypes/Products";
import Items from "./Components/ProductTypes/Items";
import Context from "./Context";

// --- NEW SOCIAL COMPONENTS ---
import CreateGroup from "./Components/CreateGroup";
import JoinGroup from "./Components/JoinGroup";

import styles from "./App.module.scss";

const App = () => {
  const { linkSuccess, isPaymentInitiation, itemId, userId, dispatch } =
    useContext(Context);

  const getInfo = useCallback(async () => {
    const response = await fetch("/api/info", { method: "POST" });
    if (!response.ok) {
      dispatch({ type: "SET_STATE", state: { backend: false } });
      return { paymentInitiation: false };
    }
    const data = await response.json();
    const paymentInitiation: boolean =
      data.products.includes("payment_initiation");

    const craProducts = data.products.filter((product: string) =>
      product.startsWith("cra_")
    );
    const isUserTokenFlow: boolean = craProducts.length > 0;
    const isCraProductsExclusively: boolean =
      craProducts.length > 0 && craProducts.length === data.products.length;

    dispatch({
      type: "SET_STATE",
      state: {
        products: data.products,
        isPaymentInitiation: paymentInitiation,
        isCraProductsExclusively: isCraProductsExclusively,
        isUserTokenFlow: isUserTokenFlow,
      },
    });
    return { paymentInitiation, isUserTokenFlow };
  }, [dispatch]);

  const generateUserToken = useCallback(async () => {
    const response = await fetch("api/create_user_token", { method: "POST" });
    if (!response.ok) {
      dispatch({ type: "SET_STATE", state: { userToken: null, userId: null } });
      return;
    }
    const data = await response.json();
    if (data) {
      if (data.error != null) {
        dispatch({
          type: "SET_STATE",
          state: {
            linkToken: null,
            linkTokenError: data.error,
          },
        });
        return;
      }
      dispatch({
        type: "SET_STATE",
        state: {
          userToken: data.user_token || null,
          userId: data.user_id || null
        }
      });
      return data.user_token || data.user_id;
    }
  }, [dispatch]);

  const generateToken = useCallback(
    async (isPaymentInitiation: boolean) => {
      const path = isPaymentInitiation
        ? "/api/create_link_token_for_payment"
        : "/api/create_link_token";
      const response = await fetch(path, {
        method: "POST",
      });
      if (!response.ok) {
        dispatch({ type: "SET_STATE", state: { linkToken: null } });
        return;
      }
      const data = await response.json();
      if (data) {
        if (data.error != null) {
          dispatch({
            type: "SET_STATE",
            state: {
              linkToken: null,
              linkTokenError: data.error,
            },
          });
          return;
        }
        dispatch({ type: "SET_STATE", state: { linkToken: data.link_token } });
      }
      localStorage.setItem("link_token", data.link_token);
    },
    [dispatch]
  );

  useEffect(() => {
    const init = async () => {
      const { paymentInitiation, isUserTokenFlow } = await getInfo();
      if (window.location.href.includes("?oauth_state_id=")) {
        dispatch({
          type: "SET_STATE",
          state: {
            linkToken: localStorage.getItem("link_token"),
          },
        });
        return;
      }

      if (isUserTokenFlow) {
        await generateUserToken();
      }
      generateToken(paymentInitiation);
    };
    init();
  }, [dispatch, generateToken, generateUserToken, getInfo]);

  return (
    <div className={styles.App}>
      <div className={styles.container}>
        <Header />
        
        {/* Standard Plaid View */}
        {linkSuccess && (
          <>
            <Products />
            {!isPaymentInitiation && itemId && <Items />}
          </>
        )}

        {/* --- SOCIAL FEATURES SECTION --- */}
        <hr style={{ margin: '40px 0', border: '0', borderTop: '1px solid #eee' }} />
        
        <div className={styles.socialSection}>
          {linkSuccess && userId ? (
            <>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', fontWeight: 'bold' }}>
                🏆 Savings Groups
              </h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '20px' 
              }}>
                <CreateGroup userId={userId} />
                <JoinGroup userId={userId} />
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <p style={{ color: '#888', fontStyle: 'italic' }}>
                Connect your bank account above to unlock  savings groups!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;