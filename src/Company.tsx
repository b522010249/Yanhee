import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../database/config";
import { Portal, Modal, Card, Text, TextInput, FAB } from "react-native-paper";
import AddEmployee from "./AddEmployee";
import DropDown from "react-native-paper-dropdown";
import AddPackage from "./AddPackage";
import AddSingleEmployee from "./AddSingleEmployee";
import ExportExcelStatus from "./ExportExcelstatus";

interface Employee {
  id: string;
  คำนำหน้า: string;
  ชื่อจริง: string;
  นามสกุล: string;
  "P.": string;
  "VN.": string;
  "HN.": string;
  ลำดับ: number;
  "ว/ด/ปีเกิด": Date;
  สถานะ: boolean;
}
interface HealthCheckType {
  id: string;
  name: string;
}
let healthCheckTypes: HealthCheckType[] = [];
const countHealthChecks = async (
  companyId: string,
  historyId: string
): Promise<{
  healthCheckCounts: HealthCheckCount[];
  totalCounts: { [key: string]: number };
}> => {
  let noCheckCount = 0;
  const employeesCollectionRef = collection(
    db,
    `Company/${companyId}/Employee`
  );

  const employeesSnapshot = await getDocs(employeesCollectionRef);

  const promises: Promise<HealthCheckCount>[] = [];

  employeesSnapshot.docs.forEach((employeeDoc) => {
    const employeeId = employeeDoc.id;
    const employeeName =
      employeeDoc.data().ชื่อจริง + " " + employeeDoc.data().นามสกุล;
    const order = employeeDoc.data().ลำดับ;
    const historyCollectionRef = collection(
      db,
      `Company/${companyId}/Employee/${employeeId}/History`
    );

    promises.push(
      (async () => {
        const historySnapshot = await getDocs(historyCollectionRef);
        const hasHistory = historySnapshot.docs.some(
          (doc) => doc.id === historyId
        );
        if (!hasHistory) {
          noCheckCount++;
          return {
            employeeId,
            employeeName,
            order,
            noCheckup: true,
            checks: {},
          };
        }
        const healthCheckCollectionRef = collection(
          db,
          `Company/${companyId}/Employee/${employeeId}/History/${historyId}/HealthCheck`
        );
        const querySnapshot = await getDocs(healthCheckCollectionRef);

        const checks: { [key: string]: boolean } = {};
        let bloodCheckFound = false;
        querySnapshot.docs.forEach((doc) => {
          const type = doc.data().type;
          const name = doc.data().name;
          const checkupstatus = doc.data().CheckupStatus;

          if (type !== "blood check") {
            checks[name] = checkupstatus; // Include PE regardless of CheckupStatus
          } else if (type === "blood check" && !checks["ตรวจรายการเจาะเลือด"]) {
            checks["ตรวจรายการเจาะเลือด"] = checkupstatus; // Include bloodCheck if not already included
          }
        });

        return {
          employeeId,
          employeeName,
          order,
          noCheckup: false,
          checks,
        };
      })()
    );
  });

  const countPerEmployee = await Promise.all(promises);

  // Calculate total counts dynamically
  const totals: { [key: string]: number } = {};

  healthCheckTypes.forEach((type) => {
    totals[type.name] = countPerEmployee.reduce(
      (acc, counts) => (counts.checks[type.id] ? acc + 1 : acc),
      0
    );
  });

  return { healthCheckCounts: countPerEmployee, totalCounts: totals };
};
interface HealthCheckCount {
  employeeId: string;
  employeeName: string;
  order: number;
  noCheckup: boolean;
  checks: { [healthCheckTypeId: string]: boolean };
}
const Company: React.FC<any> = ({ route }) => {
  const { companyId } = route.params;
  const navigation = useNavigation();
  const [visible, setVisible] = React.useState(false);
  const [visible2, setVisible2] = React.useState(false);
  const [visible3, setVisible3] = React.useState(false);
  const [healthCheckCounts, setHealthCheckCounts] = useState<
    HealthCheckCount[]
  >([]);
  const [searchInput, setSearchInput] = useState("");

  const [totalCounts, setTotalCounts] = useState<{ [key: string]: number }>({});

  const [year, setyear] = useState(new Date().getFullYear().toString());
  const [showDropDown, setShowDropDown] = useState(false);
  const [years, setYears] = useState<string[]>([]);
  const numberOfEmployees = healthCheckCounts.filter(
    (employee) => !employee.noCheckup
  ).length;
  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;

  const showModal = () => setVisible(true);
  const showModal2 = () => setVisible2(true);
  const showModal3 = () => setVisible3(true);
  const hideModal = () => setVisible(false);
  const hideModal2 = () => setVisible2(false);
  const hideModal3 = () => setVisible3(false);

  const containerStyle = {
    backgroundColor: "rgba(255, 255, 255, 1)",
    padding: 20,
  };
  useEffect(() => {
    const fetchData = async () => {
      const { healthCheckCounts, totalCounts } = await countHealthChecks(
        companyId,
        year
      );

      setHealthCheckCounts(healthCheckCounts);
      let checkCounts = {};
      healthCheckCounts.forEach((employee) => {
        Object.keys(employee.checks).forEach((checkType) => {
          if (employee.checks[checkType]) {
            if (!checkCounts[checkType]) {
              checkCounts[checkType] = 1; // Initialize count if it doesn't exist
            } else {
              checkCounts[checkType]++; // Increment count if it exists
            }
          }
        });
      });
      console.log("Health Check Counts:", checkCounts);
      console.log("healthCheckCounts:", healthCheckCounts);

      setTotalCounts((prevCounts) => ({ ...prevCounts, ...checkCounts }));
      console.log("Totalcount:", totalCounts);
    };
    const fetchYears = async () => {
      try {
        const employeeCollectionRef = collection(
          db,
          `Company/${companyId}/Employee`
        );
        const employeeSnapshot = await getDocs(employeeCollectionRef);

        const uniqueYearsSet = new Set<string>();

        // Create an array of promises for the inner fetch operations
        const fetchPromises: any[] = [];

        employeeSnapshot.forEach((employeeDoc) => {
          const employeeId = employeeDoc.id;
          const historyCollectionRef = collection(
            db,
            `Company/${companyId}/Employee/${employeeId}/History`
          );
          const historyPromise = getDocs(historyCollectionRef).then(
            (historySnapshot) => {
              historySnapshot.forEach((historyDoc) => {
                const historyId = historyDoc.id;
                // Extract the year from the history ID (assuming it's at the end)
                const year = historyId.substring(historyId.length - 4);
                uniqueYearsSet.add(year);
              });
            }
          );
          fetchPromises.push(historyPromise);
        });

        // Wait for all promises to resolve before setting the state
        await Promise.all(fetchPromises);

        const uniqueYearsArray = Array.from(uniqueYearsSet);
        setYears(uniqueYearsArray);
      } catch (error) {
        console.error("Error fetching years:", error);
      }
    };
    const fetchDataAndYears = async () => {
      await fetchYears();
      fetchData();
    };

    fetchDataAndYears();
    const employeesCollectionRef = collection(
      db,
      `Company/${companyId}/Employee`
    );
    const unsubscribe = onSnapshot(employeesCollectionRef, (snapshot) => {
      // Handle changes in the data here
      fetchData();
    });
    return () => unsubscribe();
  }, [companyId, year]);
  const handleCompanyPress = (employeeID: string, companyID: string) => {
    navigation.navigate("Employee", { employeeID, companyID });
  };
  const filteredHealthCheckCounts = healthCheckCounts.filter((employee) =>
    employee.employeeName.toLowerCase().includes(searchInput.toLowerCase())
  );
  return (
    <View style={styles.container}>
      <ExportExcelStatus healthCheckCounts={healthCheckCounts} />

      <DropDown
        label={"Year"}
        visible={showDropDown}
        showDropDown={() => setShowDropDown(true)}
        onDismiss={() => setShowDropDown(false)}
        value={year}
        setValue={setyear}
        list={years.map((year) => ({ label: year, value: year }))}
      />
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {Object.entries(totalCounts).map(([type, count]) => (
          <Card>
            <Card.Content>
              <Text variant="titleLarge" key={type}>
                {`${type}: ${count}`}/{numberOfEmployees}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </View>
      <TextInput
        label="Search"
        value={searchInput}
        onChangeText={(text) => setSearchInput(text)}
      />

      <ScrollView style={{ height: "100%", width: "100%" }}>
        <View style={styles.container2}>
          {filteredHealthCheckCounts
            .sort((a, b) => a.order - b.order)
            .map(
              ({
                employeeId,
                employeeName,
                order,
                noCheckup,
                checks, // This now contains the health check results dynamically
              }) => (
                <TouchableOpacity
                  key={employeeId}
                  onPress={() => handleCompanyPress(employeeId, companyId)}
                >
                  <Card style={{ width: 400 }}>
                    <Card.Content>
                      <Text variant="titleLarge">ลำดับ: {order}</Text>
                      <Text variant="titleLarge">ชื่อ: {employeeName}</Text>
                      {noCheckup ? (
                        <Text variant="titleLarge" style={{ color: "red" }}>
                          ไม่มีการตรวจปีนี้
                        </Text>
                      ) : (
                        Object.entries(checks).map(([checkType, checked]) => (
                          <Text
                            key={checkType}
                            variant="titleLarge"
                            style={{ color: checked ? "green" : "black" }}
                          >
                            {checkType}:{" "}
                            {checked ? "ตรวจแล้ว" : "ยังไม่ได้ตรวจ"}
                          </Text>
                        ))
                      )}
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              )
            )}
        </View>
      </ScrollView>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}
      >
        <AddEmployee companyId={companyId} />
      </Modal>
      <Modal
        visible={visible2}
        onDismiss={hideModal2}
        contentContainerStyle={containerStyle}
      >
        <AddPackage companyId={companyId} />
      </Modal>
      <Modal
        visible={visible3}
        onDismiss={hideModal3}
        contentContainerStyle={containerStyle}
      >
        <AddSingleEmployee companyId={companyId} />
      </Modal>
      <Portal>
        <FAB.Group
          open={open}
          visible
          icon={open ? "plus-minus" : "plus"}
          actions={[
            {
              icon: "account-plus",
              label: "เพิ่มคนเดียว",
              onPress: showModal3,
            },
            {
              icon: "account-multiple-plus",
              label: "เพิ่มจาก Excel",
              onPress: showModal,
            },
            { icon: "package", onPress: showModal2 },
            { icon: "package-variant", onPress: showModal2 },
            {
              icon: "barcode-scan",
              label: "barcode-scan",
              onPress: () => console.log("Pressed star"),
            },
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
        />
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container2: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignContent: "space-around",
  },
  card: {
    width: 400,
    height: 75,
    marginBottom: 10,
    backgroundColor: "#f2f2f2",
    borderColor: "#e3e3e3",
    borderWidth: 2,
    padding: 5,
    flexDirection: "row",
  },
  incard1: {
    flex: 6,
    marginLeft: 10,
    justifyContent: "center",
  },
  incard2: {
    flex: 3,
    justifyContent: "center",
  },
  AddEmployee: {
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 10,
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
});

export default Company;
