import React, { useEffect, useContext, useCallback } from "react";

import Header from "./Components/Headers";
import Products from "./Components/ProductTypes/Products";
import Items from "./Components/ProductTypes/Items";
import Context from "./Context";

// --- CUSTOM COMPONENTS ---
import CreateGroup from "./Components/CreateGroup";
import JoinGroup from "./Components/JoinGroup";
import MyGroups from "./Components/MyGroups"; 

// --- STYLING ---
import "./Components/Groups.css"; 
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
          state: { linkToken: null, linkTokenError: data.error },
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
      const response = await fetch(path, { method: "POST" });
      if (!response.ok) {
        dispatch({ type: "SET_STATE", state: { linkToken: null } });
        return;
      }
      const data = await response.json();
      if (data) {
        if (data.error != null) {
          dispatch({
            type: "SET_STATE",
            state: { linkToken: null, linkTokenError: data.error },
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
          state: { linkToken: localStorage.getItem("link_token") },
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
        
        {/* Plaid Product Display */}
        {linkSuccess && (
          <>
            <Products />
            {!isPaymentInitiation && itemId && <Items />}
          </>
        )}

        {/* --- SAVING CIRCLES DASHBOARD --- */}
        {/* Section is completely hidden until a bank account is linked */}
        {linkSuccess && (
          <div className="modern-dashboard" style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid #f0f0f0' }}>
            <div className="dashboard-content">
              <div className="text-center" style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h2 className="main-title" style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '15px', color: '#111' }}>
                  ⭕ Saving Circles
                </h2>
                <p className="subtitle" style={{ fontSize: '1.4rem', color: '#666', fontWeight: '400' }}>
                  Join a circle, save together, and reach your goals faster.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '60px' }}>
                {/* Creation & Joining Cards */}
                <div className="card-grid" style={{ 
                  display: 'flex', 
                  gap: '40px', 
                  justifyContent: 'center', 
                  flexWrap: 'wrap',
                  width: '100%' 
                }}>
                  <CreateGroup userId={userId || "sandbox-user-99"} />
                  <JoinGroup userId={userId || "sandbox-user-99"} />
                </div>

                {/* Live Member Groups List */}
                <MyGroups userId={userId || "sandbox-user-99"} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;