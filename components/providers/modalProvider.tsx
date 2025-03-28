"use client";

import { useEffect, useState } from "react";
import { CreateGroupModal } from "../modals/createGroupModal";
import InviteModal from "../modals/inviteModal";
import { LeaveGroupModal } from "../modals/leaveGroupModal";
import { MembersModal } from "../modals/membersModal";
import ImageModal from "../modals/imageModal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateGroupModal />
      <InviteModal />
      <LeaveGroupModal />
      <MembersModal />
      <ImageModal />
    </>
  );
};
