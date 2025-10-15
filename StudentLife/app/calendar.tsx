import React, { useState } from 'react';
import { View, Modal, Text, TextInput, Button, StyleSheet } from "react-native";
import { Calendar, LocaleConfig } from 'react-native-calendars';


export default function CalendarScreen() {
  const today = new Date().toISOString().split('T')[0];

  const [selected, setSelected] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [eventName, setEventText] = useState('');
  const [eventList, setEventList] = useState<string[]>([]);
  const [eventDesc, setEventDesc] = useState('');
  const [eventDescList, setDescList] = useState<string[]>([]);

  return (
    <View>
      <Calendar
      current = {today}
      onDayPress = {(day) => {
        console.log (day);
        setSelected(day.dateString);
      }}

      markedDates={{
        [selected]: {selected: true, disableTouchEvent: true}
      }}
      />
      <View style={styles.eventBtn}>
        <Button title="+ Add Event"  onPress={() => {
          setModalVisible(true);
        }}/>
      </View>
      

      <Modal
        visible = {modalVisible}
        animationType='slide'    
      >
        <View style={styles.Modal}>
          <View style={styles.modalContainer}>
            <Text>Event Info:</Text>
            <TextInput placeholder='Event Name' value={eventName} onChangeText={setEventText} style={styles.input}></TextInput>
            <TextInput placeholder='Event Description' value={eventDesc} onChangeText={setEventDesc} style={styles.input}></TextInput>
            <Button title='save' onPress={() => {
              setModalVisible(false);
              console.log('Event name: ', eventName); 

              if (eventList.length == 0) {
                setEventList(event => [eventName]);
              } else {
                setEventList(prevEvents => [...prevEvents, eventName]);
              }
              
              if (eventDescList.length == 0) {
                setDescList(desc => [eventDesc]);
              } else {
                setDescList(prevDescs => [...prevDescs, eventDesc]);
              }

              setEventText('');
              setEventDesc('');
              console.log(eventList);
              console.log(eventDescList);
            }}/>
            <Button title = "close" onPress={() => {
              setEventText('');
              setModalVisible(false); 
              } } color="black"/>
          </View>
        </View> 
      </Modal>


    </View>
  );
}

const styles = StyleSheet.create ({
  Modal: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100     //This is a really stupid way to center the add event box. Work on fixing this later
  },

  modalContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    opacity: 0.5,
  },

  input: {
    borderColor: 'black',
    borderWidth: 2,
    margin: 5,
    padding: 5
  },

  eventBtn: {
    padding:10,
    margin:10,
    textAlign: 'center',
  }
});
