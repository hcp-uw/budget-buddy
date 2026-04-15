export interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export const financeQuizzes: Record<string, Question[]> = {
  "Quiz 1: The Basics": [
    { id: "f1", question: "What is the '50/30/20 Rule' in budgeting?", options: ["50% Savings, 30% Needs, 20% Wants", "50% Needs, 30% Wants, 20% Savings", "50% Debt, 30% Needs, 20% Fun", "50% Investing, 50% Spending"], answer: "50% Needs, 30% Wants, 20% Savings", explanation: "50% essentials, 30% wants, 20% savings." },
    { id: "f2", question: "Which of these is considered a 'Liquid Asset'?", options: ["A House", "A Car", "Cash in a Savings Account", "A Vintage Watch"], answer: "Cash in a Savings Account", explanation: "Liquidity is how fast you can get cash." },
    { id: "f3", question: "What does 'Inflation' do to the value of your money?", options: ["Increases power", "Decreases power", "No effect", "Doubles it"], answer: "Decreases power", explanation: "Prices go up, so your dollar buys less." },
    { id: "f4", question: "What is an 'Emergency Fund'?", options: ["Vacation money", "3-6 months of living expenses", "A credit card", "Stock bet"], answer: "3-6 months of living expenses", explanation: "It's your financial safety net." },
    { id: "f5", question: "In the stock market, what is a 'Bear Market'?", options: ["Prices rising", "Prices falling", "Low volume", "Pro only"], answer: "Prices falling", explanation: "Bear swipes down; prices are dropping." },
    { id: "f6", question: "What is 'Compound Interest'?", options: ["Principal only", "Principal + accumulated interest", "Bank fee", "Tax type"], answer: "Principal + accumulated interest", explanation: "Interest earning interest!" },
    { id: "f7", question: "Which typically has the highest interest rate?", options: ["Mortgage", "Student Loan", "Credit Card Debt", "Auto Loan"], answer: "Credit Card Debt", explanation: "Credit cards are high-interest unsecured debt." }
  ],
  "Quiz 2: Building Wealth": [
    { id: "f8", question: "What is a 'FICO Score' used for?", options: ["Health", "Creditworthiness", "Income tax", "Stock tracking"], answer: "Creditworthiness", explanation: "Lenders use it to see if you're a risky borrower." },
    { id: "f9", question: "What does 'Diversification' mean in investing?", options: ["One stock", "Spreading across assets", "Gold only", "Under mattress"], answer: "Spreading across assets", explanation: "Don't put all your eggs in one basket." },
    { id: "f10", question: "What is a 'Dividend'?", options: ["Tax penalty", "Share of company profits", "Bank fee", "Stock cost"], answer: "Share of company profits", explanation: "Profit paid out to shareholders." },
    { id: "f11", question: "What is 'Net Worth'?", options: ["Salary", "Assets minus Liabilities", "Checking balance", "Credit limit"], answer: "Assets minus Liabilities", explanation: "What you own minus what you owe." },
    { id: "f12", question: "Which refers to the out-of-pocket amount before insurance kicks in?", options: ["Premium", "Deductible", "Co-pay", "Limit"], answer: "Deductible", explanation: "Your 'skin in the game' for insurance." },
    { id: "f13", question: "What is 'Opportunity Cost'?", options: ["Stock price", "Potential gain lost from other alternatives", "Bank fee", "Discount"], answer: "Potential gain lost from other alternatives", explanation: "The cost of what you didn't choose." },
    { id: "f14", question: "What does APR stand for?", options: ["Annual Percentage Rate", "Actual Price Ratio", "Assets per Rate", "Average Profit"], answer: "Annual Percentage Rate", explanation: "The yearly cost of borrowing." }
  ],
  "Quiz 3: Expert Habits": [
    { id: "f15", question: "What is a 'Fixed Expense'?", options: ["Changes monthly", "Stays the same monthly", "Broken car repair", "Gift"], answer: "Stays the same monthly", explanation: "Like rent or Netflix." },
    { id: "f16", question: "What does the FDIC do?", options: ["Invests in stocks", "Insures bank deposits", "Prints money", "Sets rates"], answer: "Insures bank deposits", explanation: "Protects your cash if the bank fails." },
    { id: "f17", question: "What is 'Phishing' in finance?", options: ["Seafood stocks", "Fraudulent emails for info", "Day trading", "Fishing gear"], answer: "Fraudulent emails for info", explanation: "Scammers trying to get your login." },
    { id: "f18", question: "Difference between Debit and Credit?", options: ["Limits", "Own money vs Borrowed money", "ATM use", "No difference"], answer: "Own money vs Borrowed money", explanation: "Debit is yours; Credit is a loan." },
    { id: "f19", question: "What is 'Pay Yourself First'?", options: ["Gifts", "Prioritizing savings", "Giving a raise", "Two jobs"], answer: "Prioritizing savings", explanation: "Save before you spend on bills or fun." },
    { id: "f20", question: "What is a 'Bull Market'?", options: ["No activity", "Rising prices", "Farm equipment", "Crash"], answer: "Rising prices", explanation: "Bull horns thrust UP; prices are rising." }
  ]
};