import React from 'react';
import ProfileHost from "../Host/ProfileHost";
export default function TestProfileHost() {
  const hostDetail = {
    fullName: "John Doe",
    street: "123 Main St",
    houseName: "My House",
    city: "New York",
    state: "NY",
    pinCode: "10001",
    dp: "dp.jpg", // Replace with a real image filename
    dpp: "dpp.jpg", // Replace with a real image filename
    dineCategory: "Category1",
    description: "This is a description",
    currentMessage: "This is a current message"
  };

  return <ProfileHost hostDetail={hostDetail} />;
}
