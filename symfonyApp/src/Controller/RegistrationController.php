<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Security\SimpleAuthenticator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class RegistrationController extends AbstractController
{

    #[Route('/register', name: 'app_register', methods: ['POST'])]
    public function register(Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager)
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['email']) || empty($data['password']) || empty($data['nom']) || empty($data['prenom']) || empty($data['adresse'])) {
            return $this->json(['message' => "Tous les champs sont requis"], 400);
        }
    
        $user = new User();
        $user->setEmail($data['email']);
        $user->setPassword($passwordHasher->hashPassword($user, $data['password']));
        $user->setNom($data['nom']);
        $user->setPrenom($data['prenom']);
        $user->setAdresse($data['adresse']);
        $user->setRoles(['ROLE_USER']);
    
        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json(['message' => 'Inscription réussie, veuillez vous connecter'], 201);
    }
    

}
