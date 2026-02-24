import { ConfirmDialog } from '../Common/ConfirmDialog';
import { TestGroup } from '../../api/types';

interface DeleteGroupDialogProps {
  group: TestGroup | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteGroupDialog({
  group,
  onConfirm,
  onCancel,
}: DeleteGroupDialogProps) {
  return (
    <ConfirmDialog
      isOpen={!!group}
      title="Delete Test Group"
      message={`Are you sure you want to delete "${group?.name}"? This will remove the group and all associated user assignments. This action cannot be undone.`}
      confirmLabel="Delete Group"
      cancelLabel="Cancel"
      variant="danger"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
