import User from "../models/User.js"; 

export const addUser = async () => {
  try {
    const newUser = await User.create({
      name: "Sibna",
      email: "sibna@example.com",
      password: "password123",
      role: "user"
    });
    console.log("✅ User added:", newUser);
  } catch (error) {
    console.error("❌ Error adding user:", error);
  }
};

// Call function for testing
addUser();


  