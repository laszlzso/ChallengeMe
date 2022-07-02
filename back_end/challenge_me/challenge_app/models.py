import logging
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator

logger = logging.getLogger('django')


class Challenge(models.Model):
    challenge_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=50, unique=True)
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return 'Challenge #{}: {} ({} - {})'.format(self.challenge_id, self.title, self.start_date, self.end_date)


class ChallengeType(models.Model):
    challenge_type_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    unit = models.CharField(max_length=50)

    def __str__(self):
        return 'Challenge type #{}: {} ({})'.format(self.challenge_type_id, self.name, self.unit)


class ChallengeSchedule(models.Model):
    challenge_schedule_id = models.AutoField(primary_key=True)
    challenge_id = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    challenge_type_id = models.ForeignKey(ChallengeType, on_delete=models.CASCADE)

    total_goal = models.FloatField(validators=[MinValueValidator(0.001)])
    start_date = models.DateField()  # TODO(laszlzso): add restriction for Challenge.start_date and end_date
    day_frequency = models.IntegerField(validators=[MinValueValidator(1)])

    class Meta:
        unique_together = ('challenge_id', 'user_id', 'challenge_type_id')

    def __str__(self):
        return 'Challenge schedule #{}: {}/User {}/{}; goal: {}, freq.: {} ({})'.format(
            self.challenge_schedule_id,
            self.challenge_id,
            self.user_id,
            self.challenge_type_id,
            self.total_goal,
            self.day_frequency,
            self.start_date)


class ChallengeCompletionEntry(models.Model):
    challenge_completion_entry_id = models.AutoField(primary_key=True)
    challenge_schedule_id = models.ForeignKey(ChallengeSchedule, on_delete=models.CASCADE)
    timestamp = models.DateTimeField()  # TODO(laszlzso): same fucking constraint
    amount = models.FloatField(validators=[MinValueValidator(0.001)])

    def __str__(self):
        return 'Completion entry #{}: {}, {} ({})'.format(self.challenge_completion_entry_id,
                                                          # TODO(laszlzso): fix this shit (prints the whole schedule object instead of the ID only)
                                                          self.challenge_schedule_id,
                                                          self.amount,
                                                          self.timestamp)
