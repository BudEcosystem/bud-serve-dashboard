// components/AddDeleteDialog.tsx
import React from 'react';
import {
  Button,
  Dialog,
  Flex,
} from "@radix-ui/themes";
import { Cross1Icon } from '@radix-ui/react-icons';

interface AddDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  itemTitle: string;
  itemDescription: string;
  buttonLabel: string;
}

const AddDeleteDialog: React.FC<AddDeleteDialogProps> = ({ isOpen, onClose, onSubmit, itemTitle, itemDescription, buttonLabel }) => {
  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Content maxWidth="370px" className="w-[29%] p-[1.125rem] bg-[#111113] border-0 shadow-none">
        <Flex justify="between" align="center">
          <Dialog.Title className="text-base block p-0 pt-1 m-0 font-semibold">{itemTitle}</Dialog.Title>
          <Dialog.Close onClick={onClose}>
            <Button className="m-0 p-0 pt-[.1rem] bg-[transparent] h-[1.1rem]" size="1">
              <Cross1Icon />
            </Button>
          </Dialog.Close>
        </Flex>
        <Dialog.Description className="text-xs text-[#787B83] pt-2 font-normal" mb="4">
          {itemDescription} 
        </Dialog.Description>
        <Flex gap="3" mt="4" justify="center">
          <Button size="1" className="h-[1.75rem] w-full text-xs font-normal" onClick={onSubmit}>{buttonLabel}</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AddDeleteDialog;
