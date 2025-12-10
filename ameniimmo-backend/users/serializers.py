from rest_framework import serializers
from .models import Utilisateur
from django.contrib.auth.password_validation import validate_password


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer pour l'inscription d'un nouvel utilisateur"""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Utilisateur
        fields = ('username', 'email', 'password', 'password2', 'role', 'telephone', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
            'telephone': {'required': False},
        }

    def validate(self, attrs):
        """Vérifier que les deux mots de passe correspondent"""
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})
        return attrs

    def create(self, validated_data):
        """Créer un nouvel utilisateur"""
        validated_data.pop('password2')  # Retirer password2 avant la création
        
        user = Utilisateur.objects.create(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            role=validated_data.get('role', 'visiteur'),
            telephone=validated_data.get('telephone', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        
        user.set_password(validated_data['password'])  # Hasher le mot de passe
        user.save()
        
        return user


class UserSerializer(serializers.ModelSerializer):
    """Serializer pour afficher les informations de l'utilisateur"""
    class Meta:
        model = Utilisateur
        fields = ('id', 'username', 'email', 'role', 'first_name', 'last_name', 'telephone', 'date_joined')
        read_only_fields = ('id', 'date_joined')
