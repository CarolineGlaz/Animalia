<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use App\Utils\Verify;

#[Route('/dashboard/user')]
class DashBoardUserController extends AbstractController
{
    private $entityManager;
    private $passwordHasher;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher)
    {
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
    }

    #[Route('/get', name: 'get_dashboard_users', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function getAllUsers(UserRepository $userRepository, Request $request): JsonResponse
    {
        $start = $request->query->get('start', 0);
        $size = $request->query->get('size', 10);
    
        if (!Verify::isPositiveNumber($start)) {
            return new JsonResponse(['message' => "Erreur start"], 404);
        }
        if (!Verify::isPositiveNumber($size)) {
            return new JsonResponse(['message' => "Erreur size"], 404);
        }
    
        $users = $userRepository->findAllWithPagination((int) $start, (int) $size);

        $totalUsers = $userRepository->count([]);
    
        $json = [
            'users' => $users,
            'countElement' => $totalUsers,
        ];
    
        return new JsonResponse($json);
    }




    #[Route('/ajouter', name: 'ajouter_user', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function ajouterUser(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $user = new User();
        $user->setEmail($data['email']);
        $user->setRoles($data['roles']);
        
        $encodedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($encodedPassword);

        $user->setNom($data['nom']);
        $user->setPrenom($data['prenom']);
        $user->setAdresse($data['adresse']);
    
        $this->entityManager->persist($user);
        $this->entityManager->flush();
    
        return new JsonResponse(['message' => "L'utilisateur a été ajouté"], 201);
    }

    #[Route('/modifier/{id}', name: 'modifier_dashboard_user', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function modifierUser(int $id, Request $request, UserRepository $userRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $userRepository->find($id);

        if (!$user) {
            return new JsonResponse(['message' => 'Utilisateur non trouvé'], 404);
        }

        $user->setEmail($data['email']);
        $user->setRoles($data['roles']);
        
        if (!empty($data['password'])) {
            $encodedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($encodedPassword);
        }

        $user->setNom($data['nom']);
        $user->setPrenom($data['prenom']);
        $user->setAdresse($data['adresse']);
    
        $this->entityManager->flush();
    
        return new JsonResponse(['message' => "L'utilisateur a été modifié"], 200);
    }

    #[Route('/supprimer/{id}', name: 'supprimer_dashboard_user', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function supprimerUser(int $id, UserRepository $userRepository): JsonResponse
    {
        $user = $userRepository->find($id);

        if (!$user) {
            return new JsonResponse(['message' => 'Utilisateur non trouvé'], 404);
        }

        $this->entityManager->remove($user);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Utilisateur supprimé'], 200);
    }
}
