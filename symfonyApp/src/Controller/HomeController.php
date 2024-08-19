<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Produits;

class HomeController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/', name: 'app_home')]
    public function index(): JsonResponse
    {
        $produitsRepository = $this->entityManager->getRepository(Produits::class);
        $produits = $produitsRepository->findAll();
        
        $json = ['produits' => $produits,];

        $response = new JsonResponse($json);
        return $response;
    }
 }
