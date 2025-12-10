from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Utilisateur
from .serializers import RegisterSerializer, UserSerializer


class RegisterView(generics.CreateAPIView):
    """Endpoint pour l'inscription d'un nouvel utilisateur"""
    queryset = Utilisateur.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Générer les tokens JWT
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Inscription réussie !'
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """Endpoint pour la connexion (login)"""
    permission_classes = (AllowAny,)

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({
                'error': 'Veuillez fournir un nom d\'utilisateur et un mot de passe.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Authentifier l'utilisateur
        user = authenticate(username=username, password=password)

        if user is None:
            return Response({
                'error': 'Identifiants incorrects.'
            }, status=status.HTTP_401_UNAUTHORIZED)

        # Générer les tokens JWT
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Connexion réussie !'
        }, status=status.HTTP_200_OK)


class UserProfileView(APIView):
    """Endpoint pour récupérer le profil de l'utilisateur connecté"""
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserListView(generics.ListAPIView):
    """Endpoint pour lister tous les utilisateurs (pour statistiques)"""
    queryset = Utilisateur.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)
