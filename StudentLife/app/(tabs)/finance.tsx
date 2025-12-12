import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Button,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";

export default function FinanceScreen() {
  const userName = "User"; // placeholder — replace with actual user later

  const colorScheme = useColorScheme();
  const themeTextStyle =
    colorScheme === "light" ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === "light" ? styles.lightContainer : styles.darkContainer;

  const [userId, setUserId] = useState<string | null>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);

  /**
   * Fetch current logged-in user from backend.
   * Uses existing /api/auth-check logic.
   *
   * NOTE:
   * - This assumes backend returns JSON like: { "userId": "..." }
   * - If backend uses a different field name, update it below.
   */
  const loadCurrentUser = async (): Promise<string | null> => {
    try {
      const res = await fetch("/api/auth-check", {
        credentials: "include", // important if you use cookies/session
      });

      if (!res.ok) return null;

      const data = await res.json();
      return data.userId ?? null;
    } catch (err) {
      console.error("Failed to fetch current user", err);
      return null;
    }
  };

  /**
   * Load current month's finance entries for the given user.
   */
  const loadEntries = async (uid: string) => {
    try {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;

      const res = await fetch(
        `/api/finance/entries?userId=${uid}&year=${year}&month=${month}`
      );

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Load entries failed:", res.status, text);
        return;
      }

      const data = await res.json();
      setEntries(data);

      let incomeSum = 0;
      let expenseSum = 0;

      data.forEach((e: any) => {
        if (e.EntryType === "INCOME") incomeSum += Number(e.Amount);
        if (e.EntryType === "EXPENSE") expenseSum += Number(e.Amount);
      });

      setMonthlyIncome(incomeSum);
      setMonthlyExpenses(expenseSum);
    } catch (err) {
      console.error("Failed to load finance entries", err);
    }
  };

  /**
   * Initialize page:
   * 1) Fetch current userId
   * 2) Load entries for this user
   */
  useEffect(() => {
    const init = async () => {
      const uid = await loadCurrentUser();

      if (!uid) {
        console.warn("User not logged in");
        return;
      }

      setUserId(uid);
      await loadEntries(uid);
    };

    init();
  }, []);

  /**
   * Create a new finance entry (INCOME or EXPENSE).
   * EntryType must match DB values: "INCOME" / "EXPENSE".
   */
  const addEntry = async (
    entryType: "INCOME" | "EXPENSE",
    amount: number,
    category: string
  ) => {
    if (!userId) return;

    try {
      // IMPORTANT:
      // POST route changed to avoid route conflict with GET /finance/entries
      const res = await fetch("/api/finance/entries/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          entryType,
          category,
          amount,
          entryDate: new Date().toISOString(),
          note: "",
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Add entry failed:", res.status, text);
        return;
      }

      const created = await res.json();

      // Update UI immediately without refetching
      setEntries((prev) => [created, ...prev]);

      if (entryType === "INCOME") setMonthlyIncome((prev) => prev + amount);
      if (entryType === "EXPENSE") setMonthlyExpenses((prev) => prev + amount);
    } catch (err) {
      console.error("Failed to add entry", err);
    }
  };

  // Temporary demo actions (replace with a modal/input later)
  const addIncome = async () => addEntry("INCOME", 5000, "Salary");
  const addExpense = async () => addEntry("EXPENSE", 100, "Food");

  return (
    <ScrollView style={[styles.pageContainer, themeContainerStyle]}>
      <Text style={[styles.titleText, themeTextStyle]}>
        {userName}'s Budget
      </Text>

      <View style={[styles.container, themeContainerStyle]}>
        <Text style={[styles.headerText, themeTextStyle]}>
          Monthly Income: ${monthlyIncome.toFixed(2)}
        </Text>
        <Text style={[styles.headerText, themeTextStyle]}>
          Monthly Expenses: ${monthlyExpenses.toFixed(2)}
        </Text>
      </View>

      <View style={[styles.container, themeContainerStyle]}>
        <Text style={[styles.headerText, themeTextStyle]}>
          Income Breakdown:
        </Text>
        <Button title="+ Add Income" onPress={addIncome} />
        {entries
          .filter((e) => e.EntryType === "INCOME")
          .map((e) => (
            <Text key={e.EntryID} style={[styles.text, themeTextStyle]}>
              {e.Category}: ${e.Amount}
            </Text>
          ))}
      </View>

      <View style={[styles.container, themeContainerStyle]}>
        <Text style={[styles.headerText, themeTextStyle]}>
          Expenses Breakdown:
        </Text>
        <Button title="+ Add Expenses" onPress={addExpense} />
        {entries
          .filter((e) => e.EntryType === "EXPENSE")
          .map((e) => (
            <Text key={e.EntryID} style={[styles.text, themeTextStyle]}>
              {e.Category}: ${e.Amount}
            </Text>
          ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  container: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    margin: 15,
  },
  centerTextContainer: {
    alignContent: "center",
    justifyContent: "center",
  },
  scrollView: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 15,
    margin: 10,
  },
  titleText: {
    fontSize: 35,
    margin: 10,
    padding: 10,
    fontWeight: "bold",
  },
  headerText: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: "bold",
  },
  eventText: {
    fontSize: 25,
    marginBottom: 10,
    fontWeight: "bold",
    marginLeft: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  lightContainer: {
    backgroundColor: "#fff",
    borderColor: "#151718",
  },
  darkContainer: {
    backgroundColor: "#151718",
    borderColor: "#ECEDEE",
  },
  lightThemeText: {
    color: "#11181C",
  },
  darkThemeText: {
    color: "#ECEDEE",
  },
});
