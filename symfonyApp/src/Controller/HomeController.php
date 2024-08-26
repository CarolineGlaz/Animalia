<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Produits;
use Symfony\Component\HttpFoundation\Request;
use Verify;
use Doctrine\ODM\MongoDB\DocumentManager;

class HomeController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/', name: 'app_home')]
    public function index(Request $request): JsonResponse
    {
        $start = $request->query->get('start', 0);
        $size = $request->query->get('size', 10);

        if (!Verify::isPositiveNumber($start))
            return new JsonResponse(['message' => "Erreur start"], 404);
        if (!Verify::isPositiveNumber($size))
            return new JsonResponse(['message' => "Erreur size"], 404);


        $produitsRepository = $this->entityManager->getRepository(Produits::class);
        $produits = $produitsRepository->findAllWithPagination((int) $start, (int) $size);

        $count = $produitsRepository->countProducts();

        $json = [
            'produits' => $produits,
            'countElement' => $count,
        ];

        $response = new JsonResponse($json);
        return $response;
    }
}
