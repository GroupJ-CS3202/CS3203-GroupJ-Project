// StudentLife/app/calendar.tsx (or wherever your calendar screen lives)
import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";
import { getEventsInRange, BackendEvent } from "@/services/sqlFetchService"; 
import { insertEvent } from "@/services/sqlInsertService";
import { deleteEvent } from "@/services/sqlDeleteService";
import { editEvent } from "@/services/sqlEditService"; 
export interface CalendarEvent extends BackendEvent {}

interface EventsState {
  [dateString: string]: CalendarEvent[];
}

type VisibleRange = { start: Date; end: Date };

function getMonthRange(year: number, month: number): VisibleRange {
  // month: 1–12
  const start = new Date(year, month - 1, 1); 
  const end = new Date(year, month, 1);
  return { start, end };
}

export default function CalendarScreen() {
  const colorScheme = useColorScheme();
  const themeTextStyle =
    colorScheme === "light" ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === "light" ? styles.lightContainer : styles.darkContainer;

  const today = new Date().toISOString().split("T")[0];

  // Initial visible range = this month
  const now = new Date();
  const initialRange = getMonthRange(now.getFullYear(), now.getMonth() + 1);

  const [selected, setSelected] = useState(today);
  const [modalVisible, setModalVisible] = useState(false);
  const [addEventDisabled, setAddEventDisabled] = useState(false);

  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [events, setEvents] = useState<EventsState>({});
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [visibleRange, setVisibleRange] = useState<VisibleRange>(initialRange);

  // Fetch events when visible month changes
  useEffect(() => {
    async function loadEvents() {
      try {
        const { events: apiEvents } = await getEventsInRange(
          visibleRange.start,
          visibleRange.end
        );

        const byDate: EventsState = {};
        for (const ev of apiEvents) {
          const dateKey = ev.startTime.split("T")[0]; // "YYYY-MM-DD"
          if (!byDate[dateKey]) byDate[dateKey] = [];
          byDate[dateKey].push(ev);
        }

        setEvents(byDate);
      } catch (err) {
        console.error("[CalendarScreen] Failed to load events:", err);
      }
    }

    loadEvents();
  }, [visibleRange]);

  // Build markedDates when events or selected changes
  useEffect(() => {
    const marked: MarkedDates = {};

    Object.keys(events).forEach((date) => {
      const count = events[date].length;
      if (count > 0) {
        const dots = Array.from({ length: count }).map((_, i) => ({
          key: `${date}-dot-${i}`,
          color: "blue",
        }));
        marked[date] = { dots };
      }
    });

    if (selected) {
      marked[selected] = {
        ...(marked[selected] || {}),
        selected: true,
        selectedColor: "#00adf5",
        selectedTextColor: "white",
      };
    }

    setMarkedDates(marked);
  }, [events, selected]);

  const selectedDayEvents = events[selected] || [];

  const onSaveEvent = async () => {
    if (!selected || eventTitle.trim() === "") return;

    const existingEvents = events[selected] || [];

    try {
      if (editMode && editIndex !== null) {
        const target = existingEvents[editIndex];

      // Call the editEvent service
      const updatedEvent = await editEvent({
        eventId: target.id,
        title: eventTitle,
        description: eventDesc,
        startTime: new Date(target.startTime),
        endTime: new Date(target.endTime),
      });

      setEvents((prev) => {
        const copy = [...existingEvents];
        copy[editIndex] = updatedEvent;
        return { ...prev, [selected]: copy };
      });
      } else {
        
        const start = `${selected}T00:00:00.000Z`;
        const end = `${selected}T01:00:00.000Z`;

        const savedEvent = await insertEvent({
          title: eventTitle,
          description: eventDesc,
          startTime: new Date(start),
          endTime: new Date(end),
        });
        setEvents((prev) => ({
          ...prev,
          [selected]: [...existingEvents, savedEvent],
        }));
      }
    } catch (error) {
      console.error(
        `Failed to ${editMode ? "edit" : "add"} event:`,
        error
      );
      alert(`Event failed to ${editMode ? "edit" : "save"}.`);
      return;
    }

    setModalVisible(false);
    setEventTitle("");
    setEventDesc("");
    setEditMode(false);
    setEditIndex(null);
  };

  const onDeleteEvent = async (id: string) => {
  try {
    // Call the backend to delete the event
    await deleteEvent({ eventId: id });

    // Remove the event from local state
    setEvents((prev) => ({
      ...prev,
      [selected]: prev[selected].filter((e) => e.id !== id),
    }));

    console.log(`Event ${id} deleted successfully`);
  } catch (error: any) {
    console.error("Failed to delete event:", error);
    alert(error?.message || "Failed to delete event.");
  }
};

  const onEditEvent = (index: number) => {
    if (!selectedDayEvents[index]) return;
    const event = selectedDayEvents[index];

    setEventTitle(event.title);
    setEventDesc(event.description);
    setEditMode(true);
    setEditIndex(index);
    setModalVisible(true);
  };

  return (
    <ScrollView style={themeContainerStyle}>
      <View style={themeContainerStyle}>
        <Calendar
          current={today}
          onDayPress={(day) => {
            const date = day.dateString;
            setSelected(date);
            setAddEventDisabled(false);
          }}
          onMonthChange={(month) => {
            const { start, end } = getMonthRange(month.year, month.month);
            setVisibleRange({ start, end });
          }}
          markedDates={markedDates}
          markingType="multi-dot"
          style={themeContainerStyle}
          theme={{
            backgroundColor: "#ffffffff",
            calendarBackground: "#ffffffff",
          }}
        />
      </View>

      <View style={[themeContainerStyle, styles.eventBtn]}>
        <Button
          title="+ Add Event"
          onPress={() => {
            setModalVisible(true);
          }}
          disabled={addEventDisabled}
        />
      </View>

      {selected ? (
        <View style={[themeContainerStyle, styles.eventListContainer]}>
          <Text style={[themeTextStyle, styles.eventListHeader]}>
            Event List for {selected}
          </Text>
          {selectedDayEvents.length > 0 ? (
            selectedDayEvents.map((event, index) => (
              <View
                key={event.id ?? index}
                style={[themeContainerStyle, styles.eventItem]}
              >
                <Text style={styles.eventNameText}>{event.title}</Text>
                <Text style={styles.eventDescText}>{event.description}</Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginTop: 8,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => onEditEvent(index)}
                    style={styles.eventActionBtn}
                  >
                    <Text style={{ color: "blue", marginRight: 10 }}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onDeleteEvent(event.id)}
                    style={styles.eventActionBtn}
                  >
                    <Text style={{ color: "red" }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noEventText}>No events</Text>
          )}
        </View>
      ) : (
        <View style={[themeContainerStyle, styles.eventListContainer]}>
          <Text style={styles.noEventText}>No date selected</Text>
        </View>
      )}

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.Modal}>
          <View style={styles.modalContainer}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
              {selected} Event
            </Text>
            <TextInput
              placeholder="Event Name"
              value={eventTitle}
              onChangeText={setEventTitle}
              style={styles.input}
            />
            <TextInput
              placeholder="Event Description"
              value={eventDesc}
              onChangeText={setEventDesc}
              style={styles.input}
              multiline={true}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 20,
              }}
            >
              <Button
                title="Save"
                onPress={onSaveEvent}
                disabled={eventTitle.trim() === ""}
              />
              <Button
                title="Close"
                onPress={() => {
                  setEventTitle("");
                  setEventDesc("");
                  setModalVisible(false);
                  setEditMode(false);
                  setEditIndex(null);
                }}
                color="black"
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  Modal: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },

  modalContainer: {
    width: "80%",
    margin: 20,
    padding: 20,
    borderRadius: 10,
    opacity: 1,
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  input: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 8,
    padding: 10,
    backgroundColor: "#f9f9f9",
    minHeight: 40,
    maxHeight: 120,
  },

  eventBtn: {
    padding: 10,
    margin: 10,
    textAlign: "center",
  },
  eventListContainer: {
    padding: 15,
    margin: 10,
    borderRadius: 8,
  },
  eventListHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 5,
  },
  eventItem: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#007aff",
    elevation: 1,
  },
  eventNameText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  eventDescText: {
    fontSize: 12,
    color: "#555",
  },
  noEventText: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    paddingVertical: 10,
  },
  eventActionBtn: {
    marginLeft: 5,
    marginRight: 5,
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
