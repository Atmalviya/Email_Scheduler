const agenda = require('../config/agenda');
const sendEmail = require('../services/emailService');

agenda.define('send scheduled email', async job => {
    const { to, subject, text } = job.attrs.data;
    await sendEmail({ to, subject, text });
});

(async function() {
    await agenda.start();
})();

exports.scheduleEmail = async (req, res) => {
    const { email, subject, body } = req.body;

    try {
        // Schedule the email to be sent 3 minutes from now
        const twentyMinutesFromNow = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes in milliseconds
        await agenda.schedule(twentyMinutesFromNow, 'send scheduled email', {
            to: email,
            subject,
            text: body
        });

        res.status(200).json({ message: 'Email scheduled successfully!' });
    } catch (error) {
        console.error('Error scheduling email:', error);
        res.status(500).json({ message: 'Failed to schedule email' });
    }
};
