import { findByProps } from "@vendetta/metro";
import { after } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";

let unpatch;

export default {
  onLoad() {

    // Config
    storage.config ??= {
      userId: "PUT_YOUR_ID_HERE"
    };

    const UserStore = findByProps("getUser", "getCurrentUser");

    if (!UserStore) {
      console.log("FakeEarlySupporter: UserStore not found");
      return;
    }

    unpatch = after("getUser", UserStore, ([id], user) => {
      if (!user) return user;

      // Only apply to you
      if (id !== storage.config.userId) return user;

      const EARLY_SUPPORTER = 512;

      return {
        ...user,

        publicFlags: (user.publicFlags ?? 0) | EARLY_SUPPORTER
      };
    });

    // Patch current user too
    const Current = UserStore.getCurrentUser?.();

    if (Current && Current.id === storage.config.userId) {
      Current.publicFlags |= 512;
    }
  },

  onUnload() {
    if (unpatch) unpatch();
  }
};
