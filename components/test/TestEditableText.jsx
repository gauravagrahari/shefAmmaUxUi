import React, { useState } from 'react';
import { View, Text, SafeAreaView, Button } from 'react-native';
import { EditableText } from '../commonMethods/EditableText';  // Replace './EditableText' with actual path if required.

export default function TestEditableText() {
  const [fullName, setFullName] = useState("John Doe");

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <EditableText value={fullName} onSave={setFullName} />

      {/* Just a button to display current state */}
      <Button 
        title="Show Full Name" 
        onPress={() => alert(fullName)}
      />
    </SafeAreaView>
  );
}
