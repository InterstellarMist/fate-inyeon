import { useCallback, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { MatchDocument, Profile } from "../types/apiTypes";
import useSWR from "swr";
import { getTalkJSToken } from "../lib/dataFetch";
import { Session, Chatbox } from "@talkjs/react";
import Talk from "talkjs";

interface MatchesData {
  matches: MatchDocument[];
  profiles: Profile[];
}

export const MessagesPage = () => {
  const { token } = useAuth();
  const [selectedMatch, setSelectedMatch] = useState<{
    matchId: string;
    profile: Profile;
  } | null>(null);
  const appId = import.meta.env.VITE_TALKJS_APP_ID || "";

  const {
    data: matchesData,
    error: matchesError,
    isLoading: matchesLoading,
  } = useSWR<MatchesData>("/api/matches");

  const {
    data: currentProfile,
    error: profileError,
    isLoading: profileLoading,
  } = useSWR<Profile>("/api/users/my-profile");

  // Token fetcher function for TalkJS (called automatically when needed)
  const tokenFetcher = useCallback(async () => {
    if (!token) {
      throw new Error("No authentication token available");
    }
    const response = await getTalkJSToken(token);
    return response.token;
  }, [token]);

  // Sync user for TalkJS Session
  const syncUser = useCallback((): Talk.User => {
    if (!currentProfile) {
      // Return a placeholder user if profile not loaded yet
      return new Talk.User({
        id: "loading",
        name: "Loading...",
        role: "default",
      });
    }

    return new Talk.User({
      id: currentProfile.accountId,
      name: currentProfile.name,
      email: `${currentProfile.accountId}@fate-inyeon.app`,
      photoUrl: currentProfile.picture || undefined,
      role: "default",
    });
  }, [currentProfile]);

  // Sync conversation when match is selected
  const syncConversation = useCallback(
    (session: Talk.Session): Talk.ConversationBuilder => {
      if (!selectedMatch || !currentProfile) {
        // Return a placeholder conversation if data not ready
        const placeholder = session.getOrCreateConversation("placeholder");
        return placeholder;
      }

      const other = new Talk.User({
        id: selectedMatch.profile.accountId,
        name: selectedMatch.profile.name,
        email: `${selectedMatch.profile.accountId}@fate-inyeon.app`,
        photoUrl: selectedMatch.profile.picture || undefined,
        role: "default",
      });

      const conversationId = Talk.oneOnOneId(session.me, other);
      const conversation = session.getOrCreateConversation(conversationId);
      conversation.setParticipant(session.me);
      conversation.setParticipant(other);

      return conversation;
    },
    [selectedMatch, currentProfile]
  );

  if (matchesError || profileError)
    return (
      <div className="text-white p-4">
        Error: {matchesError?.message || profileError?.message}
      </div>
    );

  if (matchesLoading || profileLoading)
    return <div className="text-white p-4">Loading...</div>;

  if (!matchesData || !currentProfile)
    return <div className="text-white p-4">No data</div>;

  // If no matches, show empty state
  if (matchesData.matches.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-center text-white text-2xl font-bold">
          No matches yet. Start swiping! 💓
        </p>
      </div>
    );
  }

  // Create a map of profile accountId to match
  const profileToMatchMap = new Map<string, MatchDocument>();
  matchesData.matches.forEach((match) => {
    // Find the other user's profile ID (not the current user's)
    const otherProfileId = match.profiles.find(
      (profileId) => profileId !== currentProfile.accountId
    );
    if (otherProfileId) {
      profileToMatchMap.set(otherProfileId, match);
    }
  });

  // Show conversation list and chat view
  return (
    <div className="flex h-full w-full">
      {/* Conversation List */}
      <div className="w-full md:w-1/3 border-r border-gray-600 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-white text-xl font-bold mb-4">Messages</h2>
          <div className="space-y-2">
            {matchesData.profiles
              .map((profile) => {
                const match = profileToMatchMap.get(profile.accountId);
                if (!match) return null;

                const isSelected =
                  selectedMatch?.matchId === match._id ||
                  selectedMatch?.profile.accountId === profile.accountId;

                return (
                  <div
                    key={match._id}
                    onClick={() =>
                      setSelectedMatch({ matchId: match._id, profile })
                    }
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-orange-500/20 border border-orange-500"
                        : "hover:bg-gray-800 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={profile.picture}
                        alt={profile.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate">
                          {profile.name}
                        </p>
                        <p className="text-gray-400 text-sm truncate">
                          {profile.location}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
              .filter(Boolean)}
          </div>
        </div>
      </div>

      {/* Chat View */}
      <div className="hidden md:flex flex-1 flex-col">
        {selectedMatch && currentProfile ? (
          <>
            <div className="p-4 border-b border-gray-600">
              <div className="flex items-center gap-3">
                <img
                  src={selectedMatch.profile.picture}
                  alt={selectedMatch.profile.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-white font-semibold">
                    {selectedMatch.profile.name}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {selectedMatch.profile.location}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              {currentProfile && (
                <Session
                  appId={appId || undefined}
                  tokenFetcher={appId ? undefined : tokenFetcher}
                  syncUser={syncUser}
                >
                  <Chatbox
                    syncConversation={syncConversation}
                    style={{ width: "100%", height: "100%" }}
                  />
                </Session>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-white text-xl">
              Select a match to start chatting
            </p>
          </div>
        )}
      </div>

      {/* Mobile: Full screen chat */}
      {selectedMatch && currentProfile && (
        <div className="md:hidden fixed inset-0 z-50 bg-black flex flex-col">
          <div className="p-4 border-b border-gray-600 bg-black">
            <button
              onClick={() => setSelectedMatch(null)}
              className="text-white mb-2"
            >
              ← Back
            </button>
            <div className="flex items-center gap-3">
              <img
                src={selectedMatch.profile.picture}
                alt={selectedMatch.profile.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-white font-semibold">
                  {selectedMatch.profile.name}
                </p>
                <p className="text-gray-400 text-sm">
                  {selectedMatch.profile.location}
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            {currentProfile && (
              <Session
                appId={appId || undefined}
                tokenFetcher={appId ? undefined : tokenFetcher}
                syncUser={syncUser}
              >
                <Chatbox
                  syncConversation={syncConversation}
                  style={{ width: "100%", height: "100%" }}
                />
              </Session>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
