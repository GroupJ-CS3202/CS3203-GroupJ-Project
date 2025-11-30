import React, { useState } from 'react';
import { View, Modal, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import { Calendar, LocaleConfig } from 'react-native-calendars';

interface Event{
  name: string;
  desc: string;
}

interface EventsState{
  [dataString: string]: Event[];
}
export default function CalendarScreen() {
  const today = new Date().toISOString().split('T')[0];

  const [selected, setSelected] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [addEventDisabled, setAddEventDisabled] = useState(true);
  const [eventName, setEventText] = useState('');
  const [eventDesc, setEventDesc] = useState('');

  const[events, setEvents] = useState<EventsState>({});
  
  const selectedDayEvents = events[selected] || [];
  const marked: any = {
    [selected]: { selected: true, disableTouchEvent: true}
  }
  Object.keys(events).forEach(date => {
    if (events[date].length>0){
      marked[date] = {
        ...(marked[date] || {}),
        marked: true,
        dotColor: 'blue'
      }
    }
  })
  const onSaveEvent = () => {
    const newEvent: Event = {name: eventName, desc : eventDesc};

    setEvents(prevEvents => {
      const existingEvents = prevEvents[selected] || [];
      return {
        ...prevEvents,
        [selected]: [...existingEvents, newEvent]
      };
    });
    setModalVisible(false);
    setEventText('');
    setEventDesc('');
    console.log('Saved Event:', newEvent.name, 'for date:', selected);
  };

  return (
    <ScrollView>
      <Calendar //TODO: send date to backend function to create const/object to display event
      current = {today}
      onDayPress = {(day) => {
        console.log (day);  //log date to console
        setSelected(day.dateString);  //marks date as selected
        setAddEventDisabled(false); //enables add event button
      }}

      markedDates={marked}
      />
      <View style={styles.eventBtn}>
        <Button
          title="+ Add Event" 
          onPress={() => {setModalVisible(true);}}  //opens add event dialog
          disabled={addEventDisabled} //determines if button is disabled
          
          />
      </View>
      {selected ? (
        <View style={styles.eventListContainer}>
          <Text style = {styles.eventListHeader}> Event List of {selected} </Text>
            {selectedDayEvents.length > 0 ?(
              selectedDayEvents.map((event, index) => (
                <View key = {index} style = {styles.eventItem}>
                  <Text style = {styles.eventNameText}>**{event.name}**</Text>
                  <Text style = {styles.eventDescText}>{event.desc}</Text>
                </View>
              ))
            ):(
              <Text style = {styles.noEventText}></Text>
            )}
            </View>
          ) : (
            <View style = {styles.eventListContainer}>
              <Text style = {styles.noEventText}></Text>
            </View>
      )}
      

      <Modal
        visible = {modalVisible}
        animationType='slide'    
      >
        <View style={styles.Modal}>
          <View style={styles.modalContainer}>
            <Text style = {{fontSize: 18, marginBottom : 10}}>{selected} Event </Text>
            <TextInput placeholder='Event Name' value={eventName} onChangeText={setEventText} style={styles.input}></TextInput>
            <TextInput placeholder='Event Description' value={eventDesc} onChangeText={setEventDesc} style={styles.input} multiline={true} ></TextInput>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
              <Button 
                title='Save' 
                onPress={onSaveEvent}
                disabled={eventName.trim() === ''} 
              />
            <Button title = "close" onPress={() => {
              setEventText('');
              setEventDesc('');
              setModalVisible(false); 
              } } color="black"/>
          </View>
        </View> 
      </View>
    </Modal>
    </ScrollView>


  );
}

const styles = StyleSheet.create ({
  Modal: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100     //This is a rather silly way to center the add event box. Work on fixing this later
  },

  modalContainer: {
    width: '80%',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    opacity: 1,
    backgroundColor:'white',
    elevation : 5,
    shadowColor : '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 8,
    padding: 10,
    backgroundColor: 'f9f9f9#',
    minHeight: 40,
    maxHeight: 120,
  },

  eventBtn: {
    padding:10,
    margin:10,
    textAlign: 'center',
  },
  eventListContainer: {
    padding: 15,
    margin: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  eventListHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  eventItem: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007aff',
    elevation: 1,
  },
  eventNameText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  eventDescText: {
    fontSize: 12,
    color: '#555',
  },
  noEventText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    paddingVertical: 10,
  }
});
