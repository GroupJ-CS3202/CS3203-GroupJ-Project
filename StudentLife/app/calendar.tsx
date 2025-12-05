import React, { useState } from 'react';
import { View, Modal, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Calendar, LocaleConfig } from 'react-native-calendars';
//import { addBlob, deleteBlob, getBlob, listEventsByDate  } from './azureBlob';
import { useEffect } from 'react';

export interface CEvent{
  name: string;
  desc: string;
  blobName: string;
}

interface EventsState{
  [dataString: string]: CEvent[];
}
export default function CalendarScreen() {
  const today = new Date().toISOString().split('T')[0];

  const [selected, setSelected] = useState(today);
  const [modalVisible, setModalVisible] = useState(false);
  const [addEventDisabled, setAddEventDisabled] = useState(selected === '' ? true:false);
  const [eventName, setEventText] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const[events, setEvents] = useState<EventsState>({});
/*
  useEffect(() => {
    async function loadEvents(){
      if (!selected) return;
      const loaded = await listEventsByDate(selected);
      setEvents(prev => ({ ...prev, [selected]: loaded} ));
    }
    loadEvents();
  }, [selected])*/
  
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
  const onSaveEvent = async () => {
    if (!selected) return;

    const existingEvents = events[selected] || [];
    
    if(editMode && editIndex !== null){
        const target = existingEvents[editIndex];

        const updatedEvent: CEvent = {
          ...target,
          name: eventName,
          desc: eventDesc
        }
        //await editEvent(target.blobName, updatedEvent);

    setEvents(prev => {
      const copy = [...existingEvents];
      copy[editIndex] = updatedEvent;
      return { ...prev, [selected]: copy };
    });

  } else {
    const blobName = `${selected}-${Date.now()}.json`;
    const newEvent: CEvent = { name: eventName, desc: eventDesc, blobName };

    //await uploadEvent(blobName, JSON.stringify(newEvent));

    setEvents(prev => ({
      ...prev,
      [selected]: [...existingEvents, newEvent]
    }));
  }

  setModalVisible(false);
  setEventText('');
  setEventDesc('');
  setEditMode(false);
  setEditIndex(null);
};
    
    const onDeleteEvent = async(blobName: string) => {
      //await deleteBlob(blobName);

      setEvents(prev => ({
        ...prev,
        [selected]:prev[selected].filter(e => e.blobName !== blobName)
      }));
    }
    
    const onEditEvent = (index : number) =>{
      if (!selectedDayEvents[index]) return;
      const event = selectedDayEvents[index];

      setEventText(event.name);
      setEventDesc(event.desc);
      setEditMode(true);
      setEditIndex(index);
      setModalVisible(true);

    }

  return (
    <ScrollView>
      <Calendar 
      current = {today}
      onDayPress = {(day) => {
        console.log (day);  
        setSelected(day.dateString);  
        setAddEventDisabled(false); 
      }}

      markedDates={marked}
      />
      <View style={styles.eventBtn}>
        <Button
          title="+ Add Event" 
          onPress={() => {setModalVisible(true);}} 
          disabled={addEventDisabled} 
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

                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <TouchableOpacity onPress={() => onEditEvent(index)} style={styles.eventActionBtn}>
                      <Text style={{ color: 'blue', marginRight: 10 }}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDeleteEvent(event.blobName)} style={styles.eventActionBtn}>
                      <Text style={{ color: 'red' }}>Delete</Text>
                   </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noEventText}>No events</Text>
          )}
        </View>
      ) : (
        <View style={styles.eventListContainer}>
          <Text style={styles.noEventText}>No date selected</Text>
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
    paddingTop: 100    
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
  },eventActions: {
    flexDirection: 'row',
    position: 'absolute',
    right: 10,
    top: 10,
  },
  smallButton: {
    backgroundColor: '#007aff',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  eventActionBtn:{
    marginLeft: 5,
    marginRight: 5
  }
})
