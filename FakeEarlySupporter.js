import { findByProps } from "@vendetta/metro";
import { after } from "@vendetta/patcher";

let unpatch;

export default {
  onLoad() {
    const UserStore = findByProps("getUser", "getCurrentUser");

    if (!UserStore) return;

    const EARLY = 512;

    unpatch = after("getUser", UserStore, ([id], user) => {
      if (!user) return user;

      if (id !== UserStore.getCurrentUser()?.id) return user;

      return {
        ...user,
        publicFlags: (user.publicFlags ?? 0) | EARLY
      };
    });
  },

  onUnload() {
    if (unpatch) unpatch();
  }
};
