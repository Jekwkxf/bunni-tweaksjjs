// ==VendettaPlugin==
// @name Fake Early Supporter
// @description Adds the Early Supporter badge locally (client-side only)
// @version 1.0.0
// @author You
// ==/VendettaPlugin==

import { findByProps } from "@vendetta/metro";
import { after } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";

let unpatch;

export default {
  onLoad() {

    storage.config ??= {
      userId: "105319454656729088"
    };

    const UserStore = findByProps("getUser", "getCurrentUser");

    if (!UserStore) {
      console.log("FakeEarlySupporter: UserStore not found");
      return;
    }

    unpatch = after("getUser", UserStore, ([id], user) => {
      if (!user) return user;

      if (id !== storage.config.userId) return user;

      const EARLY_SUPPORTER = 512;

      return {
        ...user,
        publicFlags: (user.publicFlags ?? 0) | EARLY_SUPPORTER
      };
    });

    const current = UserStore.getCurrentUser?.();

    if (current && current.id === storage.config.userId) {
      current.publicFlags |= 512;
    }
  },

  onUnload() {
    if (unpatch) unpatch();
  }
};
