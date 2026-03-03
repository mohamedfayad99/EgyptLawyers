import {
    Button, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle,
} from '@mui/material';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    confirmColor?: 'success' | 'error' | 'warning' | 'primary';
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = 'Confirm',
    confirmColor = 'primary',
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    return (
        <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onCancel} sx={{ textTransform: 'none' }}>
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color={confirmColor}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                    {confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
