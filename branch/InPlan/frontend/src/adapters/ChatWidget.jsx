import React from "react";

import { ChatWidget } from "@papercups-io/chat-widget";

import { useAppContext } from "@inplan/AppContext";

export default function Widget() {
  const { debug, userData: user } = useAppContext();

  return debug ? null : (
    <ChatWidget
      accountId="44cc3ee8-75ee-4a03-a51a-f31595e3de0d"
      title="Welcome to orthoin3d"
      subtitle="Ask us anything in the chat window below 😊"
      primaryColor="#0693e3"
      greeting=""
      awayMessage=""
      newMessagePlaceholder="Start typing..."
      showAgentAvailability={false}
      agentAvailableText="We're online right now!"
      agentUnavailableText="We're away at the moment."
      requireEmailUpfront={false}
      iconVariant="outlined"
      baseUrl="https://app.papercups.io"
      // Optionally include data about your customer here to identify them
      customer={{
        name: user.last_name,
        email: user.email,
        external_id: user.id,
        //   metadata: {
        //     plan: "premium"
        //   }
      }}
    />
  );
}
