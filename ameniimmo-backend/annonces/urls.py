from rest_framework.routers import SimpleRouter
from .views import ImmobilierViewSet

router = SimpleRouter()
router.register(r"", ImmobilierViewSet, basename="immobilier")

urlpatterns = router.urls
