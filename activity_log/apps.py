from django.apps import AppConfig

class ActivityLogConfig(AppConfig):
    name = 'activity_log'

    def ready(self):
        import activity_log.signals

class ActivityLogConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "activity_log"
