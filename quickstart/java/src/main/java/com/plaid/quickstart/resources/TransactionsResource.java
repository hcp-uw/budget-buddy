package com.plaid.quickstart.resources;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import com.plaid.client.request.PlaidApi;
import com.plaid.client.model.TransactionsSyncRequest;
import com.plaid.client.model.TransactionsSyncResponse;
import com.plaid.client.model.Transaction;
import com.plaid.client.model.RemovedTransaction;
import com.plaid.quickstart.QuickstartApplication;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import retrofit2.Response;

@Path("/transactions")
@Produces(MediaType.APPLICATION_JSON)
public class TransactionsResource {
  private final PlaidApi plaidClient;


  public TransactionsResource(PlaidApi plaidClient) {
    this.plaidClient = plaidClient;
  }

  @GET
  public TransactionsResponse getTransactions() throws IOException, InterruptedException {
    // Set cursor to empty to receive all historical updates
    String cursor = null;

    // New transaction updates since "cursor"
    List<Transaction> added = new ArrayList<Transaction>();
    List<Transaction> modified = new ArrayList<Transaction>();
    List<RemovedTransaction> removed = new ArrayList<RemovedTransaction>();
    boolean hasMore = true;
    // Iterate through each page of new transaction updates for item
    while (hasMore) {
      TransactionsSyncRequest request = new TransactionsSyncRequest()
        .accessToken(QuickstartApplication.accessToken)
        .cursor(cursor);

      Response<TransactionsSyncResponse> response = plaidClient.transactionsSync(request).execute();
      TransactionsSyncResponse responseBody = response.body();

      cursor = responseBody.getNextCursor();

      // If no transactions are available yet, wait and poll the endpoint.
      // Normally, we would listen for a webhook, but the Quickstart doesn't
      // support webhooks. For a webhook example, see
      // https://github.com/plaid/tutorial-resources or
      // https://github.com/plaid/pattern

      if (cursor.equals("")) {
          Thread.sleep(2000); 
          continue; 
      }
      // Add this page of results
      added.addAll(responseBody.getAdded());
      modified.addAll(responseBody.getModified());
      removed.addAll(responseBody.getRemoved());
      hasMore = responseBody.getHasMore();
    }

    // Return the 8 most recent transactions
    added.sort(new TransactionsResource.CompareTransactionDate());
    List<Transaction> latestTransactions = added.subList(Math.max(added.size() - 8, 0), added.size());
    
    // Call Node.js backend to sync to Supabase
    try {
      callNodeBackendSync();
    } catch (Exception e) {
      System.err.println("Failed to sync to Node backend: " + e.getMessage());
      e.printStackTrace();
    }
    
    return new TransactionsResponse(latestTransactions);
  }

  private class CompareTransactionDate implements Comparator<Transaction> {
    @Override
    public int compare(Transaction o1, Transaction o2) {
        return o1.getDate().compareTo(o2.getDate());
    }
  }

  private void callNodeBackendSync() throws IOException {
    // Make HTTP call to Node.js backend to sync transactions to Supabase
    String url = "http://localhost:8000/api/transactions/sync";
    
    okhttp3.OkHttpClient client = new okhttp3.OkHttpClient();
    okhttp3.MediaType jsonMediaType = okhttp3.MediaType.get("application/json; charset=utf-8");
    String json = "{}";
    okhttp3.RequestBody body = okhttp3.RequestBody.create(json, jsonMediaType);
    okhttp3.Request request = new okhttp3.Request.Builder()
        .url(url)
        .post(body)
        .build();
    
    try (okhttp3.Response response = client.newCall(request).execute()) {
      if (response.isSuccessful()) {
        System.out.println("✅ Node backend sync successful: " + response.body().string());
      } else {
        System.out.println("❌ Node backend sync failed: " + response.code() + " " + response.message());
      }
    }
  }
  
  private static class TransactionsResponse {
    @JsonProperty
    private final List<Transaction> latest_transactions;
  
    public TransactionsResponse(List<Transaction> latestTransactions) {
      this.latest_transactions = latestTransactions;
    }
  }
}
