<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Produits;
use Symfony\Component\HttpFoundation\Request;
use App\Utils\Verify;
use Doctrine\ODM\MongoDB\DocumentManager;
use App\Entity\CardAnimals;

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
        $categorie = $request->query->get('categorie', null);
    
        if (!Verify::isPositiveNumber($start)) {
            return new JsonResponse(['message' => "Erreur start"], 404);
        }
        if (!Verify::isPositiveNumber($size)) {
            return new JsonResponse(['message' => "Erreur size"], 404);
        }
    
        $produitsRepository = $this->entityManager->getRepository(Produits::class);
        $produits = $produitsRepository->findAllWithPagination((int) $start, (int) $size, $categorie);
    
        $count = $produitsRepository->countProducts($categorie);
    
        $json = [
            'produits' => $produits,
            'countElement' => $count,
        ];
    
        return new JsonResponse($json);
    }



    #[Route('/card', name: 'card')]
    public function card(Request $request): JsonResponse
    {
        $cardRepository = $this->entityManager->getRepository(CardAnimals::class);
        $cards = $cardRepository->findAll();
    
        // Transforme les objets en un truc qui est compatible avec json
        $data = array_map(fn($card) => [
            'id' => $card->getId(),
            'titre' => $card->getTitre(),
            'contenu' => $card->getContenu(),
            'data' => $card->getData(),
        ], $cards);
    
        $json = [
            'cardAnimals' => $data,
        ];
    
        return new JsonResponse($json);
    }

}
