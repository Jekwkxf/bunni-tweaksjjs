import { findByProps } from "@vendetta/metro";
import { after } from "@vendetta/patcher";

let unpatch: (() => void) | undefined;

export default {
  onLoad() {
    const UserStore = findByProps("getUser", "getCurrentUser");

    if (!UserStore) return;

    const EARLY_SUPPORTER = 1 << 9; // 512

    unpatch = after("getUser", UserStore, ([id], user) => {
      if (!user) return user;

      const me = UserStore.getCurrentUser?.();

      if (!me || id !== me.id) return user;

      return {
        ...user,
        publicFlags: (user.publicFlags ?? 0) | EARLY_SUPPORTER
      };
    });
  },

  onUnload() {
    if (unpatch) unpatch();
  }
};
