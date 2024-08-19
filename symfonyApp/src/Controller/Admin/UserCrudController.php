<?php

namespace App\Controller\Admin;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserCrudController extends AbstractCrudController
{

    private $userPasswordHasher;

    public function __construct(UserPasswordHasherInterface $userPasswordHasher)
    {
        $this->userPasswordHasher = $userPasswordHasher;
    }

    public static function getEntityFqcn(): string
    {
        return User::class;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('nom')->setLabel('Nom'),
            TextField::new('prenom')->setLabel('Prénom'),
            TextField::new('adresse')->setLabel('Adresse'),
            TextField::new('email')->setLabel('adresse email'),
            TextField::new('password')->setLabel('Mot de passe'),
            ChoiceField::new('roles')->setLabel('Roles')
                ->setChoices([
                    'Utilisateur' => 'USER',
                    'Employé' => 'EMPLOYE',
                ])
                ->setFormTypeOptions(['multiple' => true]),
        ];
    }

    public function persistEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        // Vérifier si l'entité est une instance de User
        if ($entityInstance instanceof User) {
            // Hasher le mot de passe avant de le sauvegarder en base de données
            $entityInstance->setPassword(
                $this->userPasswordHasher->hashPassword(
                    $entityInstance,
                    $entityInstance->getPassword()
                )
            );
        }
        parent::persistEntity($entityManager, $entityInstance);
    }
}

