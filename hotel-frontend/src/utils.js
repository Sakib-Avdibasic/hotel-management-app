// formatting date into input[type="date"] format
export const formatDate = date => date.toISOString().split('T')[0];

// formatting date into local format
export const localizeDate = date => date.toLocaleDateString('hrv-hr');

// function for showing warning for invalid input attempt
export const handleWarning = (setShowWarning, setWarning, warning) => {
	setShowWarning(true);
	setWarning(warning);
	setTimeout(() => setShowWarning(false), 5000);
};
